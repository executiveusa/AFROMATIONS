import struct
import uuid
import zlib

from storage.s3 import upload_bytes
from tools.registry import ToolInput, ToolRegistry, ToolSchema


def _make_png(width: int = 64, height: int = 64, color: tuple = (220, 50, 50)) -> bytes:
    """Generate a minimal valid PNG with a solid color."""

    def chunk(name: bytes, data: bytes) -> bytes:
        c = struct.pack(">I", len(data)) + name + data
        return c + struct.pack(">I", zlib.crc32(c[4:]) & 0xFFFFFFFF)

    header = b"\x89PNG\r\n\x1a\n"
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    ihdr = chunk(b"IHDR", ihdr_data)

    raw = b""
    for _ in range(height):
        raw += b"\x00" + bytes(color) * width
    idat = chunk(b"IDAT", zlib.compress(raw))
    iend = chunk(b"IEND", b"")
    return header + ihdr + idat + iend


async def handle_generate_image(inputs: dict) -> dict:
    prompt = inputs.get("prompt", "anime warrior")
    style = inputs.get("style", "anime")
    width = int(inputs.get("width", 1024))
    height = int(inputs.get("height", 1024))
    seed = inputs.get("seed", 42)

    # Mock: generate a solid-color PNG and upload to MinIO
    color = (220, 50, 50)  # AFROMATIONS red
    png_bytes = _make_png(64, 64, color)

    key = f"images/{uuid.uuid4()}.png"
    url, s3_key = upload_bytes(png_bytes, key=key, content_type="image/png")

    return {
        "image_url": url,
        "s3_key": s3_key,
        "seed": seed,
        "width": width,
        "height": height,
        "style": style,
        "prompt": prompt,
        "model": "mock-diffusion-v1",
    }


_schema = ToolSchema(
    name="generate_image",
    description="Generate an anime-style image from a text prompt using a diffusion model.",
    inputs=[
        ToolInput(name="prompt", type="string", description="Image generation prompt"),
        ToolInput(name="style", type="string", description="Visual style", required=False, default="anime"),
        ToolInput(name="width", type="number", description="Image width in pixels", required=False, default=1024),
        ToolInput(name="height", type="number", description="Image height in pixels", required=False, default=1024),
        ToolInput(name="seed", type="number", description="RNG seed for reproducibility", required=False, default=42),
    ],
    outputs=[
        ToolInput(name="image_url", type="string", description="Public URL of the generated image"),
        ToolInput(name="s3_key", type="string", description="MinIO object key"),
        ToolInput(name="seed", type="number", description="Seed used"),
    ],
    cost_credits=2.0,
    queue="generation",
)

ToolRegistry.register(_schema, handle_generate_image)
