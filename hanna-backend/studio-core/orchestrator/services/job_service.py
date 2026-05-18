import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from orchestrator.dag_engine.builder import DAGWorkflow
from storage.models import Job, JobStatus, JobStep, Project, User


class JobService:
    async def create_project_if_needed(
        self, user_id: str, prompt: str, db: AsyncSession
    ) -> Project:
        project = Project(
            user_id=user_id,
            name=prompt[:80],
            description=prompt,
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        return project

    async def create_job(
        self,
        user_id: str,
        project_id: str,
        prompt: str,
        workflow: DAGWorkflow,
        credits_estimated: float,
        db: AsyncSession,
    ) -> Job:
        job = Job(
            id=workflow.id,
            user_id=user_id,
            project_id=project_id,
            prompt=prompt,
            status=JobStatus.pending,
            dag=workflow.to_dict(),
            credits_estimated=credits_estimated,
        )
        db.add(job)
        await db.flush()

        for node in workflow.nodes:
            step = JobStep(
                job_id=job.id,
                tool_name=node.tool,
                node_id=node.id,
                status=JobStatus.pending,
                inputs=node.inputs,
            )
            db.add(step)

        await db.commit()
        await db.refresh(job)
        return job

    async def update_job_status(
        self,
        job_id: str,
        status: JobStatus,
        db: AsyncSession,
        result: dict | None = None,
        error: str | None = None,
    ) -> None:
        res = await db.execute(select(Job).where(Job.id == job_id))
        job = res.scalar_one_or_none()
        if not job:
            return
        job.status = status
        if result is not None:
            job.result = result
        if error is not None:
            job.error = error
        if status == JobStatus.running and not job.started_at:
            job.started_at = datetime.utcnow()
        if status in (JobStatus.completed, JobStatus.failed):
            job.completed_at = datetime.utcnow()
        await db.commit()

    async def get_job(self, job_id: str, db: AsyncSession) -> Job | None:
        res = await db.execute(select(Job).where(Job.id == job_id))
        return res.scalar_one_or_none()

    async def get_job_steps(self, job_id: str, db: AsyncSession) -> list[JobStep]:
        res = await db.execute(select(JobStep).where(JobStep.job_id == job_id))
        return list(res.scalars().all())

    async def get_or_create_guest_user(self, db: AsyncSession) -> User:
        """Return a shared guest user for unauthenticated /chat requests."""
        res = await db.execute(select(User).where(User.email == "guest@afromations.internal"))
        user = res.scalar_one_or_none()
        if user:
            return user
        from passlib.context import CryptContext
        ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
        user = User(
            email="guest@afromations.internal",
            hashed_password=ctx.hash(uuid.uuid4().hex),
            credits=1000.0,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
