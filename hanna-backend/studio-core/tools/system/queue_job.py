import uuid
from datetime import datetime

from tools.registry import ToolInput, ToolRegistry, ToolSchema


async def handle_queue_job(inputs: dict) -> dict:
    tool_name = inputs.get("tool_name", "")
    tool_inputs = inputs.get("inputs", {})
    priority = int(inputs.get("priority", 5))

    # Dispatch to appropriate Celery task
    task_id = str(uuid.uuid4())

    TASK_MAP = {
        "generate_image": "workers.tasks.generation_tasks.run_generate_image",
        "generate_video": "workers.tasks.generation_tasks.run_generate_video",
        "generate_voice": "workers.tasks.generation_tasks.run_generate_voice",
        "lip_sync_character": "workers.tasks.generation_tasks.run_lip_sync_character",
        "compose_scene": "workers.tasks.composition_tasks.run_compose_scene",
        "render_video": "workers.tasks.composition_tasks.run_render_video",
    }

    celery_task_name = TASK_MAP.get(tool_name)
    if celery_task_name:
        from workers.celery_app import celery_app
        result = celery_app.send_task(celery_task_name, args=[tool_inputs], priority=priority)
        task_id = result.id

    return {
        "task_id": task_id,
        "tool_name": tool_name,
        "queued_at": datetime.utcnow().isoformat(),
        "priority": priority,
    }


_schema = ToolSchema(
    name="queue_job",
    description="Queue a single tool execution as an async Celery task.",
    inputs=[
        ToolInput(name="tool_name", type="string", description="Name of the tool to execute"),
        ToolInput(name="inputs", type="object", description="Tool input parameters"),
        ToolInput(name="priority", type="number", description="Task priority 1-9", required=False, default=5),
    ],
    outputs=[
        ToolInput(name="task_id", type="string", description="Celery task ID"),
        ToolInput(name="queued_at", type="string", description="ISO timestamp"),
    ],
    cost_credits=0.0,
    queue="generation",
)

ToolRegistry.register(_schema, handle_queue_job)
