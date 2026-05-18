from services.generative_ai.image_model import ImageModel
from services.generative_ai.video_model import VideoModel
from services.generative_ai.voice_model import VoiceModel


class GenerativeAIRouter:
    def __init__(self) -> None:
        self._image = ImageModel()
        self._video = VideoModel()
        self._voice = VoiceModel()

    async def generate_image(
        self,
        prompt: str,
        style: str = "anime",
        width: int = 1024,
        height: int = 1024,
        seed: int = 42,
    ) -> dict:
        return await self._image.generate(prompt=prompt, style=style, width=width, height=height, seed=seed)

    async def generate_video(
        self,
        prompt: str,
        style: str = "anime",
        duration: float = 5.0,
        fps: int = 24,
    ) -> dict:
        return await self._video.generate(prompt=prompt, style=style, duration=duration, fps=fps)

    async def generate_voice(
        self,
        text: str,
        character: str = "hana",
        emotion: str = "neutral",
        speed: float = 1.0,
    ) -> dict:
        return await self._voice.generate(text=text, character=character, emotion=emotion, speed=speed)


ai_router = GenerativeAIRouter()
