import uuid

from tools.registry import ToolInput, ToolRegistry, ToolSchema


async def handle_compose_scene(inputs: dict) -> dict:
    image_url = inputs.get("image_url", "")
    audio_url = inputs.get("audio_url", "")
    video_url = inputs.get("video_url", "")
    title = inputs.get("title", "Untitled Scene")
    duration = float(inputs.get("duration", 5.0))

    scene_id = str(uuid.uuid4())
    scene_data = {
        "scene_id": scene_id,
        "title": title,
        "duration": duration,
        "resolution": "1920x1080",
        "timeline": [
            {
                "layer": "background",
                "asset_url": image_url,
                "start": 0.0,
                "end": duration,
                "type": "image",
            },
            {
                "layer": "character_video",
                "asset_url": video_url or image_url,
                "start": 0.0,
                "end": duration,
                "type": "video",
            },
            {
                "layer": "audio",
                "asset_url": audio_url,
                "start": 0.0,
                "end": duration,
                "type": "audio",
            },
        ],
        "effects": [
            {"type": "fade_in", "duration": 0.5},
            {"type": "fade_out", "start": duration - 0.5, "duration": 0.5},
        ],
    }

    return {
        "scene_data": scene_data,
        "scene_id": scene_id,
        "duration": duration,
    }


_schema = ToolSchema(
    name="compose_scene",
    description="Assemble a scene timeline from image, audio, and video assets.",
    inputs=[
        ToolInput(name="image_url", type="string", description="Background/character image URL"),
        ToolInput(name="audio_url", type="string", description="Voice/audio asset URL"),
        ToolInput(name="video_url", type="string", description="Animated character video URL", required=False, default=""),
        ToolInput(name="title", type="string", description="Scene title", required=False, default="Untitled Scene"),
        ToolInput(name="duration", type="number", description="Scene duration in seconds", required=False, default=5.0),
    ],
    outputs=[
        ToolInput(name="scene_data", type="object", description="Scene manifest with timeline"),
        ToolInput(name="scene_id", type="string", description="Unique scene identifier"),
        ToolInput(name="duration", type="number", description="Scene duration in seconds"),
    ],
    cost_credits=1.0,
    queue="composition",
)

ToolRegistry.register(_schema, handle_compose_scene)
