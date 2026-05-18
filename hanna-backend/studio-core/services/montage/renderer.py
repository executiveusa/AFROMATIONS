import struct
import uuid

from storage.s3 import upload_bytes

RESOLUTION_MAP = {
    "720p": (1280, 720),
    "1080p": (1920, 1080),
    "4k": (3840, 2160),
}


class Renderer:
    async def render(
        self,
        scene_data: dict,
        output_format: str = "mp4",
        resolution: str = "1080p",
    ) -> dict:
        scene_id = scene_data.get("scene_id", str(uuid.uuid4()))
        duration = float(scene_data.get("duration", 5.0))
        dims = RESOLUTION_MAP.get(resolution, (1920, 1080))

        # Mock render: create a stub MP4 and upload to MinIO
        ftyp = struct.pack(">I", 20) + b"ftyp" + b"isom" + struct.pack(">I", 0) + b"isom"
        meta = f"rendered scene={scene_id} res={resolution} dur={duration:.1f}s".encode()
        mdat = struct.pack(">I", 8 + len(meta)) + b"mdat" + meta
        video_bytes = ftyp + mdat

        key = f"renders/{uuid.uuid4()}.{output_format}"
        url, s3_key = upload_bytes(video_bytes, key=key, content_type=f"video/{output_format}")

        return {
            "video_url": url,
            "s3_key": s3_key,
            "file_size": len(video_bytes),
            "duration": duration,
            "resolution": resolution,
            "width": dims[0],
            "height": dims[1],
            "format": output_format,
            "scene_id": scene_id,
        }
