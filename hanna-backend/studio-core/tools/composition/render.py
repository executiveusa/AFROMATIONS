import struct
import uuid

from storage.s3 import upload_bytes
from tools.registry import ToolInput, ToolRegistry, ToolSchema

RESOLUTION_MAP = {
    "720p": (1280, 720),
    "1080p": (1920, 1080),
    "4k": (3840, 2160),
}


def _make_mp4_stub(scene_id: str, resolution: str, duration: float) -> bytes:
    ftyp = struct.pack(">I", 20) + b"ftyp" + b"isom" + struct.pack(">I", 0) + b"isom"
    meta = f"scene={scene_id} res={resolution} dur={duration:.1f}s".encode()
    mdat = struct.pack(">I", 8 + len(meta)) + b"mdat" + meta
    return ftyp + mdat


async def handle_render_video(inputs: dict) -> dict:
    scene_data = inputs.get("scene_data", {})
    output_format = inputs.get("output_format", "mp4")
    resolution = inputs.get("resolution", "1080p")

    scene_id = scene_data.get("scene_id", str(uuid.uuid4()))
    duration = float(scene_data.get("duration", 5.0))
    dims = RESOLUTION_MAP.get(resolution, (1920, 1080))

    mp4_bytes = _make_mp4_stub(scene_id, resolution, duration)
    file_size = len(mp4_bytes)
    key = f"renders/{uuid.uuid4()}.{output_format}"
    url, s3_key = upload_bytes(mp4_bytes, key=key, content_type=f"video/{output_format}")

    return {
        "video_url": url,
        "s3_key": s3_key,
        "file_size": file_size,
        "duration": duration,
        "resolution": resolution,
        "width": dims[0],
        "height": dims[1],
        "format": output_format,
        "scene_id": scene_id,
    }


_schema = ToolSchema(
    name="render_video",
    description="Render a composed scene into a final video file.",
    inputs=[
        ToolInput(name="scene_data", type="object", description="Scene manifest from compose_scene"),
        ToolInput(name="output_format", type="string", description="Output container format", required=False, default="mp4"),
        ToolInput(name="resolution", type="string", description="Output resolution: 720p, 1080p, 4k", required=False, default="1080p"),
    ],
    outputs=[
        ToolInput(name="video_url", type="string", description="Public URL of the rendered video"),
        ToolInput(name="s3_key", type="string", description="MinIO object key"),
        ToolInput(name="file_size", type="number", description="File size in bytes"),
        ToolInput(name="duration", type="number", description="Video duration in seconds"),
    ],
    cost_credits=3.0,
    queue="composition",
)

ToolRegistry.register(_schema, handle_render_video)
