import asyncio

from workers.celery_app import celery_app


def _run(coro):
    return asyncio.run(coro)


@celery_app.task(
    name="workers.tasks.composition_tasks.run_compose_scene",
    bind=True,
    max_retries=3,
    queue="composition",
)
def run_compose_scene(self, inputs: dict) -> dict:
    try:
        from tools.composition.scene import handle_compose_scene
        return _run(handle_compose_scene(inputs))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@celery_app.task(
    name="workers.tasks.composition_tasks.run_render_video",
    bind=True,
    max_retries=3,
    queue="composition",
)
def run_render_video(self, inputs: dict) -> dict:
    try:
        from tools.composition.render import handle_render_video
        return _run(handle_render_video(inputs))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
