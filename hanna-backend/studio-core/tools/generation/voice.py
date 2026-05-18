import struct
import uuid

from storage.s3 import upload_bytes
from tools.registry import ToolInput, ToolRegistry, ToolSchema


def _make_wav(text: str = "", sample_rate: int = 22050) -> bytes:
    """Generate a minimal valid WAV file (silence)."""
    # Approximate duration from text length (100 chars ≈ 1 second)
    duration_secs = max(1.0, len(text) / 100)
    num_samples = int(duration_secs * sample_rate)
    data = b"\x00\x00" * num_samples  # 16-bit silence

    data_size = len(data)
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        36 + data_size,
        b"WAVE",
        b"fmt ",
        16,       # chunk size
        1,        # PCM
        1,        # mono
        sample_rate,
        sample_rate * 2,  # byte rate
        2,        # block align
        16,       # bits per sample
        b"data",
        data_size,
    )
    return header + data


async def handle_generate_voice(inputs: dict) -> dict:
    text = inputs.get("text", "Hello, I am Hana.")
    character = inputs.get("character", "hana")
    emotion = inputs.get("emotion", "neutral")
    speed = float(inputs.get("speed", 1.0))

    wav_bytes = _make_wav(text)
    duration_secs = max(1.0, len(text) / 100) / speed
    key = f"audio/{uuid.uuid4()}.wav"
    url, s3_key = upload_bytes(wav_bytes, key=key, content_type="audio/wav")

    return {
        "audio_url": url,
        "s3_key": s3_key,
        "duration_seconds": round(duration_secs, 2),
        "character": character,
        "emotion": emotion,
        "text": text,
        "model": "mock-tts-v1",
    }


_schema = ToolSchema(
    name="generate_voice",
    description="Generate character voice audio from text using a TTS model.",
    inputs=[
        ToolInput(name="text", type="string", description="The dialogue text to speak"),
        ToolInput(name="character", type="string", description="Character voice profile", required=False, default="hana"),
        ToolInput(name="emotion", type="string", description="Emotional tone", required=False, default="neutral"),
        ToolInput(name="speed", type="number", description="Speech speed multiplier", required=False, default=1.0),
    ],
    outputs=[
        ToolInput(name="audio_url", type="string", description="Public URL of the generated audio"),
        ToolInput(name="s3_key", type="string", description="MinIO object key"),
        ToolInput(name="duration_seconds", type="number", description="Audio duration in seconds"),
    ],
    cost_credits=1.5,
    queue="generation",
)

ToolRegistry.register(_schema, handle_generate_voice)
