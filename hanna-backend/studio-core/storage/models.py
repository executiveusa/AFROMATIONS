import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SAEnum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class UserRole(str, Enum):
    admin = "admin"
    creator = "creator"
    user = "user"


class JobStatus(str, Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"


class AssetType(str, Enum):
    image = "image"
    video = "video"
    audio = "audio"
    scene = "scene"
    composite = "composite"


class Base(DeclarativeBase):
    pass


def _uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.user, nullable=False)
    credits: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    projects: Mapped[list["Project"]] = relationship("Project", back_populates="user")
    jobs: Mapped[list["Job"]] = relationship("Job", back_populates="user")
    credit_transactions: Mapped[list["CreditTransaction"]] = relationship(
        "CreditTransaction", back_populates="user"
    )


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    meta: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="projects")
    jobs: Mapped[list["Job"]] = relationship("Job", back_populates="project")
    assets: Mapped[list["Asset"]] = relationship("Asset", back_populates="project")


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    project_id: Mapped[Optional[str]] = mapped_column(ForeignKey("projects.id"))
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[JobStatus] = mapped_column(
        SAEnum(JobStatus), default=JobStatus.pending, nullable=False
    )
    dag: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON)
    result: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON)
    error: Mapped[Optional[str]] = mapped_column(Text)
    credits_estimated: Mapped[float] = mapped_column(Float, default=0.0)
    credits_used: Mapped[float] = mapped_column(Float, default=0.0)
    celery_task_id: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    user: Mapped["User"] = relationship("User", back_populates="jobs")
    project: Mapped[Optional["Project"]] = relationship("Project", back_populates="jobs")
    steps: Mapped[list["JobStep"]] = relationship("JobStep", back_populates="job")


class JobStep(Base):
    __tablename__ = "job_steps"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    job_id: Mapped[str] = mapped_column(ForeignKey("jobs.id"), nullable=False)
    tool_name: Mapped[str] = mapped_column(String(100), nullable=False)
    node_id: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[JobStatus] = mapped_column(
        SAEnum(JobStatus), default=JobStatus.pending, nullable=False
    )
    inputs: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON)
    outputs: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON)
    error: Mapped[Optional[str]] = mapped_column(Text)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    job: Mapped["Job"] = relationship("Job", back_populates="steps")


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), nullable=False)
    job_id: Mapped[Optional[str]] = mapped_column(ForeignKey("jobs.id"))
    asset_type: Mapped[AssetType] = mapped_column(SAEnum(AssetType), nullable=False)
    url: Mapped[str] = mapped_column(String(1000), nullable=False)
    s3_key: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[Optional[int]] = mapped_column(Integer)
    meta: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="assets")


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    job_id: Mapped[Optional[str]] = mapped_column(ForeignKey("jobs.id"))
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    balance_after: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="credit_transactions")
