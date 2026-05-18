import uuid


class SceneAssembler:
    def assemble(self, assets: dict) -> dict:
        """Build a timeline manifest from a dict of resolved asset URLs."""
        duration = float(assets.get("duration", 5.0))
        scene_id = assets.get("scene_id", str(uuid.uuid4()))

        timeline = []
        if assets.get("image_url"):
            timeline.append({
                "layer": "background",
                "asset_url": assets["image_url"],
                "type": "image",
                "start": 0.0,
                "end": duration,
            })
        if assets.get("video_url"):
            timeline.append({
                "layer": "character",
                "asset_url": assets["video_url"],
                "type": "video",
                "start": 0.0,
                "end": duration,
            })
        if assets.get("audio_url"):
            timeline.append({
                "layer": "audio",
                "asset_url": assets["audio_url"],
                "type": "audio",
                "start": 0.0,
                "end": duration,
            })

        return {
            "scene_id": scene_id,
            "title": assets.get("title", "Untitled Scene"),
            "duration": duration,
            "resolution": "1920x1080",
            "fps": 24,
            "timeline": timeline,
            "effects": [
                {"type": "fade_in", "duration": 0.5, "start": 0.0},
                {"type": "fade_out", "duration": 0.5, "start": duration - 0.5},
            ],
        }
