import struct
import uuid

from storage.s3 import upload_bytes
from tools.registry import ToolInput, ToolRegistry, ToolSchema


def _make_mp4_stub(label: str = "lip_sync") -> bytes:
    ftyp = struct.pack(">I", 20) + b"ftyp" + b"isom" + struct.pack(">I", 0) + b"isom"
    payload = f"[mock lip_sync {label}]".encode()
    mdat = struct.pack(">I", 8 + len(payload)) + b"mdat" + payload
    return ftyp + mdat


async def handle_lip_sync_character(inputs: dict) -> dict:
    image_url = inputs.get("image_url", "")
    audio_url = inputs.get("audio_url", "")
    character = inputs.get("character", "warrior")

    mp4_bytes = _make_mp4_stub(character)
    key = f"lip_sync/{uuid.uuid4()}.mp4"
    url, s3_key = upload_bytes(mp4_bytes, key=key, content_type="video/mp4")

    return {
        "video_url": url,
        "s3_key": s3_key,
        "character": character,
        "source_image_url": image_url,
        "source_audio_url": audio_url,
        "model": "mock-lipsync-v1",
    }


_schema = ToolSchema(
    name="lip_sync_character",
    description="Animate a character image to lip-sync with an audio clip.",
    inputs=[
        ToolInput(name="image_url", type="string", description="Character image to animate"),
        ToolInput(name="audio_url", type="string", description="Audio clip to sync lips to"),
        ToolInput(name="character", type="string", description="Character identifier", required=False, default="warrior"),
    ],
    outputs=[
        ToolInput(name="video_url", type="string", description="Public URL of the lip-synced video"),
        ToolInput(name="s3_key", type="string", description="MinIO object key"),
    ],
    cost_credits=5.0,
    queue="generation",
)

ToolRegistry.register(_schema, handle_lip_sync_character)
