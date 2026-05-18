import struct
import uuid

from storage.s3 import upload_bytes
from tools.registry import ToolInput, ToolRegistry, ToolSchema


def _make_mp4_stub(duration: float = 5.0) -> bytes:
    """Minimal stub bytes representing a placeholder MP4."""
    # ftyp box: 4-byte size + 'ftyp' + brand 'isom' + version + compatible brands
    ftyp = struct.pack(">I", 20) + b"ftyp" + b"isom" + struct.pack(">I", 0) + b"isom"
    # mdat box with a small placeholder payload
    payload = f"[mock mp4 duration={duration}s]".encode()
    mdat = struct.pack(">I", 8 + len(payload)) + b"mdat" + payload
    return ftyp + mdat


async def handle_generate_video(inputs: dict) -> dict:
    prompt = inputs.get("prompt", "anime scene")
    style = inputs.get("style", "anime")
    duration = float(inputs.get("duration_seconds", 5.0))
    fps = int(inputs.get("fps", 24))

    mp4_bytes = _make_mp4_stub(duration)
    key = f"videos/{uuid.uuid4()}.mp4"
    url, s3_key = upload_bytes(mp4_bytes, key=key, content_type="video/mp4")

    return {
        "video_url": url,
        "s3_key": s3_key,
        "duration": duration,
        "fps": fps,
        "prompt": prompt,
        "style": style,
        "model": "mock-video-v1",
    }


_schema = ToolSchema(
    name="generate_video",
    description="Generate a short anime video clip from a text prompt.",
    inputs=[
        ToolInput(name="prompt", type="string", description="Video generation prompt"),
        ToolInput(name="style", type="string", description="Visual style", required=False, default="anime"),
        ToolInput(name="duration_seconds", type="number", description="Clip duration in seconds", required=False, default=5.0),
        ToolInput(name="fps", type="number", description="Frames per second", required=False, default=24),
    ],
    outputs=[
        ToolInput(name="video_url", type="string", description="Public URL of the generated video"),
        ToolInput(name="s3_key", type="string", description="MinIO object key"),
        ToolInput(name="duration", type="number", description="Actual duration in seconds"),
    ],
    cost_credits=10.0,
    queue="generation",
)

ToolRegistry.register(_schema, handle_generate_video)
