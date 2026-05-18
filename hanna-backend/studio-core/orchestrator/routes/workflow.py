import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from credits.manager import estimate_dag_cost
from orchestrator.dag_engine.builder import DAGNode, DAGWorkflow
from orchestrator.dag_engine.executor import DAGExecutor
from orchestrator.services.job_service import JobService
from storage.db import get_db
from tools.registry import ToolRegistry

router = APIRouter(prefix="/workflow", tags=["workflow"])
_executor = DAGExecutor()
_job_svc = JobService()


class WorkflowRequest(BaseModel):
    tools: list[str]
    inputs: dict
    user_id: str | None = None


@router.post("/execute")
async def execute_workflow(
    req: WorkflowRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Execute a custom linear workflow directly, bypassing intent parsing."""
    if req.user_id:
        from sqlalchemy import select
        from storage.models import User
        res = await db.execute(select(User).where(User.id == req.user_id))
        user = res.scalar_one_or_none()
    else:
        user = None

    if not user:
        user = await _job_svc.get_or_create_guest_user(db)

    job_id = str(uuid.uuid4())
    nodes = [
        DAGNode(
            id=f"{tool}_{i}",
            tool=tool,
            inputs=req.inputs,
            depends_on=[f"{req.tools[i - 1]}_{i - 1}"] if i > 0 else [],
        )
        for i, tool in enumerate(req.tools)
    ]
    workflow = DAGWorkflow(id=job_id, nodes=nodes)
    cost = estimate_dag_cost(req.tools)
    project = await _job_svc.create_project_if_needed(user.id, f"Custom: {req.tools}", db)
    job = await _job_svc.create_job(user.id, project.id, str(req.tools), workflow, cost, db)

    result = await _executor.execute(workflow, job.id, db)

    return {
        "job_id": job.id,
        "project_id": project.id,
        "status": "completed",
        "result": result,
        "credits_used": cost,
    }


@router.get("/tools")
async def list_tools() -> list[dict]:
    return ToolRegistry.list_tools()
