from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from logging_config.logger import configure_logging, get_logger
from storage.db import init_db
from storage.s3 import ensure_bucket

configure_logging(debug=settings.debug)
log = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("startup.begin", app=settings.app_name)

    await init_db()
    log.info("startup.db_ready")

    try:
        ensure_bucket()
        log.info("startup.minio_ready", bucket=settings.minio_bucket)
    except Exception as exc:
        log.warning("startup.minio_failed", error=str(exc))

    # Register all tools by importing their modules
    import tools.composition  # noqa: F401
    import tools.generation  # noqa: F401
    import tools.system  # noqa: F401
    log.info("startup.tools_registered")

    yield

    log.info("shutdown.begin")


app = FastAPI(
    title=settings.app_name,
    description="Agentic AI creative platform backend — Hana agent, DAG orchestration, async generation.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from orchestrator.routes.chat import router as chat_router  # noqa: E402
from orchestrator.routes.status import router as status_router  # noqa: E402
from orchestrator.routes.workflow import router as workflow_router  # noqa: E402
from auth.dependencies import router as auth_router  # noqa: E402

app.include_router(chat_router)
app.include_router(workflow_router)
app.include_router(status_router)
app.include_router(auth_router)


@app.get("/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok", "service": settings.app_name, "version": "1.0.0"}


@app.get("/", tags=["health"])
async def root() -> dict:
    return {
        "service": settings.app_name,
        "docs": "/docs",
        "health": "/health",
    }
