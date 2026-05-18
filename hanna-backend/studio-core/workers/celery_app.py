from celery import Celery

from config import settings

celery_app = Celery(
    "afromations",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=[
        "workers.tasks.generation_tasks",
        "workers.tasks.composition_tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_routes={
        "workers.tasks.generation_tasks.*": {"queue": "generation"},
        "workers.tasks.composition_tasks.*": {"queue": "composition"},
    },
    task_default_queue="generation",
    broker_connection_retry_on_startup=True,
)
