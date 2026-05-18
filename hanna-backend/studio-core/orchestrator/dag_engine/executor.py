import re
from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from logging_config.logger import get_logger
from orchestrator.dag_engine.builder import DAGNode, DAGWorkflow
from storage.models import Job, JobStatus, JobStep

log = get_logger(__name__)

CELERY_TASK_MAP = {
    "generate_image": "workers.tasks.generation_tasks.run_generate_image",
    "generate_video": "workers.tasks.generation_tasks.run_generate_video",
    "generate_voice": "workers.tasks.generation_tasks.run_generate_voice",
    "lip_sync_character": "workers.tasks.generation_tasks.run_lip_sync_character",
    "compose_scene": "workers.tasks.composition_tasks.run_compose_scene",
    "render_video": "workers.tasks.composition_tasks.run_render_video",
    "estimate_cost": "workers.tasks.generation_tasks.run_estimate_cost",
    "queue_job": "workers.tasks.generation_tasks.run_queue_job",
    "get_status": "workers.tasks.generation_tasks.run_get_status",
}

_REF_PATTERN = re.compile(r"^\$ref:(.+?)\.(.+)$")


def _resolve_refs(value: Any, completed: dict[str, dict]) -> Any:
    """Replace $ref:nodeId.field strings with actual output values."""
    if isinstance(value, str):
        m = _REF_PATTERN.match(value)
        if m:
            node_id, field = m.group(1), m.group(2)
            node_outputs = completed.get(node_id, {})
            return node_outputs.get(field, value)
        return value
    if isinstance(value, dict):
        return {k: _resolve_refs(v, completed) for k, v in value.items()}
    if isinstance(value, list):
        return [_resolve_refs(item, completed) for item in value]
    return value


async def _update_step(
    db: AsyncSession,
    job_id: str,
    node: DAGNode,
    status: JobStatus,
    outputs: dict | None = None,
    error: str | None = None,
) -> None:
    result = await db.execute(
        select(JobStep).where(JobStep.job_id == job_id, JobStep.node_id == node.id)
    )
    step = result.scalar_one_or_none()
    if not step:
        return
    step.status = status
    if status == JobStatus.running:
        step.started_at = datetime.utcnow()
    if status in (JobStatus.completed, JobStatus.failed):
        step.completed_at = datetime.utcnow()
    if outputs is not None:
        step.outputs = outputs
    if error is not None:
        step.error = error
    await db.commit()


class DAGExecutor:
    async def execute(
        self, workflow: DAGWorkflow, job_id: str, db: AsyncSession
    ) -> dict:
        """
        Execute the DAG node-by-node in topological order.
        Resolves $ref inputs from previously completed nodes.
        Dispatches each node to the appropriate Celery task and waits for result.
        Returns the outputs of the final node.
        """
        from workers.celery_app import celery_app

        ordered = workflow.topological_order()
        completed: dict[str, dict] = {}

        # Mark job running
        job_result = await db.execute(select(Job).where(Job.id == job_id))
        job = job_result.scalar_one_or_none()
        if job:
            job.status = JobStatus.running
            job.started_at = datetime.utcnow()
            await db.commit()

        final_outputs: dict = {}

        for node in ordered:
            resolved_inputs = _resolve_refs(node.inputs, completed)
            await _update_step(db, job_id, node, JobStatus.running)

            log.info("dag.node.start", job_id=job_id, node_id=node.id, tool=node.tool)

            task_name = CELERY_TASK_MAP.get(node.tool)
            if not task_name:
                error = f"No Celery task for tool '{node.tool}'"
                await _update_step(db, job_id, node, JobStatus.failed, error=error)
                raise RuntimeError(error)

            last_exc: Exception | None = None
            outputs: dict = {}

            for attempt in range(node.retry_limit):
                try:
                    async_result = celery_app.send_task(task_name, args=[resolved_inputs])
                    # Block until result is ready (timeout = 120s per node)
                    outputs = async_result.get(timeout=120)
                    break
                except Exception as exc:
                    last_exc = exc
                    log.warning(
                        "dag.node.retry",
                        job_id=job_id,
                        node_id=node.id,
                        attempt=attempt + 1,
                        error=str(exc),
                    )
            else:
                error_msg = str(last_exc)
                await _update_step(db, job_id, node, JobStatus.failed, error=error_msg)

                if job:
                    job.status = JobStatus.failed
                    job.error = error_msg
                    job.completed_at = datetime.utcnow()
                    await db.commit()

                raise RuntimeError(f"Node '{node.id}' failed after {node.retry_limit} attempts: {last_exc}")

            completed[node.id] = outputs
            final_outputs = outputs
            await _update_step(db, job_id, node, JobStatus.completed, outputs=outputs)
            log.info("dag.node.done", job_id=job_id, node_id=node.id, tool=node.tool)

        # Mark job completed
        if job:
            job.status = JobStatus.completed
            job.result = final_outputs
            job.completed_at = datetime.utcnow()
            await db.commit()

        return final_outputs
