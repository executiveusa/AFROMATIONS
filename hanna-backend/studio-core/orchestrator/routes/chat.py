import asyncio
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from credits.manager import check_credits, deduct_credits, estimate_dag_cost
from logging_config.logger import get_logger
from orchestrator.dag_engine.executor import DAGExecutor
from orchestrator.services.intent_parser import IntentParser
from orchestrator.services.job_service import JobService
from orchestrator.services.tool_selector import ToolSelector
from storage.db import get_db
from storage.models import JobStatus

log = get_logger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

_parser = IntentParser()
_selector = ToolSelector()
_executor = DAGExecutor()
_job_svc = JobService()


class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    job_id: str
    project_id: str
    status: str
    message: str
    dag_preview: list[str]
    credits_estimated: float


class ChatSyncResponse(ChatResponse):
    result: Optional[dict] = None
    video_url: Optional[str] = None


async def _run_dag_background(job_id: str, project_id: str, user_id: str) -> None:
    from storage.db import AsyncSessionLocal
    async with AsyncSessionLocal() as db:
        try:
            from orchestrator.dag_engine.builder import DAGWorkflow
            from storage.models import Job
            from sqlalchemy import select

            res = await db.execute(select(Job).where(Job.id == job_id))
            job = res.scalar_one_or_none()
            if not job or not job.dag:
                return

            workflow = DAGWorkflow.from_dict(job.dag)
            final = await _executor.execute(workflow, job_id, db)

            cost = job.credits_estimated
            await deduct_credits(user_id, cost, f"Job {job_id}", db, job_id=job_id)

        except Exception as exc:
            log.error("chat.background.error", job_id=job_id, error=str(exc))


@router.post("/", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ChatResponse:
    # Resolve user
    if req.user_id:
        from sqlalchemy import select
        from storage.models import User
        res = await db.execute(select(User).where(User.id == req.user_id))
        user = res.scalar_one_or_none()
    else:
        user = None

    if not user:
        user = await _job_svc.get_or_create_guest_user(db)

    intent = _parser.parse(req.message)
    workflow = _selector.build_dag(intent, job_id=None)  # type: ignore[arg-type]

    import uuid
    workflow.id = str(uuid.uuid4())

    cost = estimate_dag_cost(workflow.tool_names)
    project = await _job_svc.create_project_if_needed(user.id, req.message, db)
    job = await _job_svc.create_job(user.id, project.id, req.message, workflow, cost, db)

    background_tasks.add_task(_run_dag_background, job.id, project.id, user.id)

    log.info("chat.dispatched", job_id=job.id, tools=workflow.tool_names)

    return ChatResponse(
        job_id=job.id,
        project_id=project.id,
        status="queued",
        message=f"Hana is on it. Running {len(workflow.nodes)} steps.",
        dag_preview=workflow.tool_names,
        credits_estimated=cost,
    )


@router.post("/sync", response_model=ChatSyncResponse)
async def chat_sync(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db),
) -> ChatSyncResponse:
    """Synchronous chat — waits for full pipeline completion before responding."""
    if req.user_id:
        from sqlalchemy import select
        from storage.models import User
        res = await db.execute(select(User).where(User.id == req.user_id))
        user = res.scalar_one_or_none()
    else:
        user = None

    if not user:
        user = await _job_svc.get_or_create_guest_user(db)

    import uuid
    intent = _parser.parse(req.message)
    workflow = _selector.build_dag(intent, job_id=str(uuid.uuid4()))

    cost = estimate_dag_cost(workflow.tool_names)
    project = await _job_svc.create_project_if_needed(user.id, req.message, db)
    job = await _job_svc.create_job(user.id, project.id, req.message, workflow, cost, db)

    result = await _executor.execute(workflow, job.id, db)
    await deduct_credits(user.id, cost, f"Job {job.id}", db, job_id=job.id)

    video_url = result.get("video_url")

    return ChatSyncResponse(
        job_id=job.id,
        project_id=project.id,
        status="completed",
        message="Scene generated successfully.",
        dag_preview=workflow.tool_names,
        credits_estimated=cost,
        result=result,
        video_url=video_url,
    )
