from config import settings


class VideoModel:
    async def generate(
        self,
        prompt: str,
        style: str = "anime",
        duration: float = 5.0,
        fps: int = 24,
    ) -> dict:
        if settings.replicate_api_key:
            # Real implementation placeholder
            pass

        return {
            "video_url": "https://placeholder.afromations.io/mock-video.mp4",
            "duration": duration,
            "fps": fps,
            "model": "mock-video-v1",
            "prompt": prompt,
            "style": style,
        }
