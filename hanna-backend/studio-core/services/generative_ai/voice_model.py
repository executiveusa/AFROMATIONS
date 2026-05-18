from config import settings


class VoiceModel:
    async def generate(
        self,
        text: str,
        character: str = "hana",
        emotion: str = "neutral",
        speed: float = 1.0,
    ) -> dict:
        if settings.elevenlabs_api_key:
            # Real implementation placeholder (ElevenLabs API)
            pass

        duration = max(1.0, len(text) / 100) / speed
        return {
            "audio_url": "https://placeholder.afromations.io/mock-voice.wav",
            "duration_seconds": round(duration, 2),
            "character": character,
            "emotion": emotion,
            "model": "mock-tts-v1",
        }
