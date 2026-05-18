from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database
    database_url: str = "postgresql+asyncpg://afromations:secret@localhost:5432/afromations"
    database_url_sync: str = "postgresql://afromations:secret@localhost:5432/afromations"

    # Redis / Celery
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/1"

    # MinIO / S3
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "afromations-assets"
    minio_secure: bool = False

    # Auth
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    # App
    app_name: str = "AFROMATIONS Studio Core"
    debug: bool = False

    # External AI APIs
    openai_api_key: Optional[str] = None
    replicate_api_key: Optional[str] = None
    elevenlabs_api_key: Optional[str] = None


settings = Settings()
