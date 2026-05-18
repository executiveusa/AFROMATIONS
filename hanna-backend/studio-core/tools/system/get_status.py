from tools.registry import ToolInput, ToolRegistry, ToolSchema


async def handle_get_status(inputs: dict) -> dict:
    job_id = inputs.get("job_id", "")

    # In a live context this runs inside a Celery task (no async DB access).
    # Use synchronous SQLAlchemy here via the sync URL.
    try:
        from sqlalchemy import create_engine, select
        from sqlalchemy.orm import Session

        from config import settings
        from storage.models import Job

        engine = create_engine(settings.database_url_sync)
        with Session(engine) as session:
            job = session.execute(select(Job).where(Job.id == job_id)).scalar_one_or_none()
            if not job:
                return {"status": "not_found", "progress": 0.0, "result": None}

            steps_total = len(job.steps)
            steps_done = sum(1 for s in job.steps if s.status.value == "completed")
            progress = (steps_done / steps_total * 100) if steps_total else 0.0

            return {
                "status": job.status.value,
                "progress": round(progress, 1),
                "result": job.result,
                "error": job.error,
            }
    except Exception as exc:
        return {"status": "error", "progress": 0.0, "result": None, "error": str(exc)}


_schema = ToolSchema(
    name="get_status",
    description="Get the current status and progress of a job.",
    inputs=[
        ToolInput(name="job_id", type="string", description="Job UUID to query"),
    ],
    outputs=[
        ToolInput(name="status", type="string", description="Job status: pending, running, completed, failed"),
        ToolInput(name="progress", type="number", description="Completion percentage 0-100"),
        ToolInput(name="result", type="object", description="Job result if completed", required=False),
    ],
    cost_credits=0.0,
    queue="generation",
)

ToolRegistry.register(_schema, handle_get_status)
