from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from orchestrator.services.job_service import JobService
from storage.db import get_db

router = APIRouter(prefix="/status", tags=["status"])
_job_svc = JobService()


@router.get("/{job_id}")
async def get_job_status(job_id: str, db: AsyncSession = Depends(get_db)) -> dict:
    job = await _job_svc.get_job(job_id, db)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    steps = await _job_svc.get_job_steps(job_id, db)
    total = len(steps)
    done = sum(1 for s in steps if s.status.value == "completed")
    progress = round((done / total * 100) if total else 0.0, 1)

    return {
        "job_id": job.id,
        "status": job.status.value,
        "progress": progress,
        "steps_total": total,
        "steps_done": done,
        "credits_estimated": job.credits_estimated,
        "credits_used": job.credits_used,
        "created_at": job.created_at.isoformat(),
        "started_at": job.started_at.isoformat() if job.started_at else None,
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
        "result": job.result,
        "error": job.error,
    }


@router.get("/{job_id}/steps")
async def get_job_steps(job_id: str, db: AsyncSession = Depends(get_db)) -> list[dict]:
    job = await _job_svc.get_job(job_id, db)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    steps = await _job_svc.get_job_steps(job_id, db)
    return [
        {
            "id": s.id,
            "node_id": s.node_id,
            "tool": s.tool_name,
            "status": s.status.value,
            "inputs": s.inputs,
            "outputs": s.outputs,
            "error": s.error,
            "started_at": s.started_at.isoformat() if s.started_at else None,
            "completed_at": s.completed_at.isoformat() if s.completed_at else None,
        }
        for s in steps
    ]
