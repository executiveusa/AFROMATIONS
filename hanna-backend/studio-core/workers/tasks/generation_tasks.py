import asyncio

from workers.celery_app import celery_app


def _run(coro):
    """Run an async coroutine from a sync Celery task."""
    return asyncio.run(coro)


@celery_app.task(
    name="workers.tasks.generation_tasks.run_generate_image",
    bind=True,
    max_retries=3,
    queue="generation",
)
def run_generate_image(self, inputs: dict) -> dict:
    try:
        from tools.generation.image import handle_generate_image
        return _run(handle_generate_image(inputs))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@celery_app.task(
    name="workers.tasks.generation_tasks.run_generate_video",
    bind=True,
    max_retries=3,
    queue="generation",
)
def run_generate_video(self, inputs: dict) -> dict:
    try:
        from tools.generation.video import handle_generate_video
        return _run(handle_generate_video(inputs))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@celery_app.task(
    name="workers.tasks.generation_tasks.run_generate_voice",
    bind=True,
    max_retries=3,
    queue="generation",
)
def run_generate_voice(self, inputs: dict) -> dict:
    try:
        from tools.generation.voice import handle_generate_voice
        return _run(handle_generate_voice(inputs))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@celery_app.task(
    name="workers.tasks.generation_tasks.run_lip_sync_character",
    bind=True,
    max_retries=3,
    queue="generation",
)
def run_lip_sync_character(self, inputs: dict) -> dict:
    try:
        from tools.generation.lip_sync import handle_lip_sync_character
        return _run(handle_lip_sync_character(inputs))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@celery_app.task(
    name="workers.tasks.generation_tasks.run_estimate_cost",
    bind=True,
    max_retries=1,
    queue="generation",
)
def run_estimate_cost(self, inputs: dict) -> dict:
    from tools.system.cost import handle_estimate_cost
    return _run(handle_estimate_cost(inputs))


@celery_app.task(
    name="workers.tasks.generation_tasks.run_queue_job",
    bind=True,
    max_retries=1,
    queue="generation",
)
def run_queue_job(self, inputs: dict) -> dict:
    from tools.system.queue_job import handle_queue_job
    return _run(handle_queue_job(inputs))


@celery_app.task(
    name="workers.tasks.generation_tasks.run_get_status",
    bind=True,
    max_retries=1,
    queue="generation",
)
def run_get_status(self, inputs: dict) -> dict:
    from tools.system.get_status import handle_get_status
    return _run(handle_get_status(inputs))
