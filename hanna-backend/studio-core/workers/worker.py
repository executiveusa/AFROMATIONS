"""Standalone entry point for starting Celery workers manually."""
from workers.celery_app import celery_app

if __name__ == "__main__":
    celery_app.worker_main(["worker", "--loglevel=info", "-Q", "generation,composition"])
