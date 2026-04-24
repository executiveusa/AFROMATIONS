#!/usr/bin/env python3
"""Seedance 2.0 MCP Server — AI video generation via Replicate.

Wraps ByteDance Seedance 2.0 for anime explainer videos, short clips,
and creative content. Supports text-to-video, image-to-video,
and audio-driven generation.

MCP stdio transport (JSON-RPC 2.0 over stdin/stdout).
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error

SERVER_NAME = "seedance-mcp"
SERVER_VERSION = "0.1.0"
REPLICATE_MODEL = "bytedance/seedance-2.0"

# ---------------------------------------------------------------------------
# Replicate HTTP helpers (no SDK needed — pure stdlib)
# ---------------------------------------------------------------------------

def _replicate_headers() -> dict[str, str]:
    token = os.environ.get("REPLICATE_API_TOKEN", "")
    if not token:
        raise RuntimeError("REPLICATE_API_TOKEN not set")
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": "wait",
    }


def _post(url: str, payload: dict) -> dict:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=_replicate_headers(), method="POST")
    with urllib.request.urlopen(req, timeout=600) as resp:
        return json.loads(resp.read())


def _get(url: str) -> dict:
    req = urllib.request.Request(url, headers=_replicate_headers())
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read())


# ---------------------------------------------------------------------------
# Tool implementations
# ---------------------------------------------------------------------------

def _generate_video(
    prompt: str,
    duration: int = 5,
    resolution: str = "720p",
    aspect_ratio: str = "16:9",
    generate_audio: bool = True,
    seed: int | None = None,
    image: str | None = None,
    last_frame_image: str | None = None,
) -> dict:
    """Generate a video using Seedance 2.0 via Replicate."""
    inp: dict = {
        "prompt": prompt,
        "duration": duration,
        "resolution": resolution,
        "aspect_ratio": aspect_ratio,
        "generate_audio": generate_audio,
    }
    if seed is not None:
        inp["seed"] = seed
    if image:
        inp["image"] = image
    if last_frame_image:
        inp["last_frame_image"] = last_frame_image

    try:
        result = _post(
            "https://api.replicate.com/v1/models/bytedance/seedance-2.0/predictions",
            {"input": inp},
        )
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else str(e)
        return {"error": f"Replicate API error {e.code}: {body}"}

    # If we got a completed prediction (Prefer: wait), return output
    status = result.get("status", "unknown")
    if status == "succeeded":
        return {
            "status": "succeeded",
            "video_url": result.get("output", ""),
            "prediction_id": result.get("id", ""),
            "metrics": result.get("metrics", {}),
        }
    elif status in ("starting", "processing"):
        return {
            "status": status,
            "prediction_id": result.get("id", ""),
            "poll_url": result.get("urls", {}).get("get", ""),
            "note": "Video is generating. Use check_video_status to poll.",
        }
    else:
        return {"status": status, "detail": result}


def _check_video_status(prediction_id: str) -> dict:
    """Poll a Replicate prediction for completion."""
    try:
        result = _get(f"https://api.replicate.com/v1/predictions/{prediction_id}")
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else str(e)
        return {"error": f"Replicate API error {e.code}: {body}"}

    status = result.get("status", "unknown")
    out: dict = {
        "status": status,
        "prediction_id": prediction_id,
    }
    if status == "succeeded":
        out["video_url"] = result.get("output", "")
        out["metrics"] = result.get("metrics", {})
    elif status == "failed":
        out["error"] = result.get("error", "Unknown error")
    return out


def _generate_explainer(
    topic: str,
    style: str = "anime",
    duration: int = 10,
    voice_prompt: str = "",
) -> dict:
    """High-level: generate an explainer video for a given topic.

    Constructs an optimized Seedance prompt combining the topic,
    visual style, and optional narration direction.
    """
    style_map = {
        "anime": "cinematic anime style, vibrant colors, detailed cel shading, Studio Ghibli quality",
        "manga": "black and white manga panel animation, dramatic ink strokes, bold composition",
        "modern": "sleek modern motion graphics, clean typography, minimal aesthetic",
        "kawaii": "cute kawaii style, pastel colors, rounded shapes, cheerful atmosphere",
    }
    visual = style_map.get(style, style_map["anime"])

    prompt_parts = [
        f"Educational explainer video about: {topic}.",
        f"Visual style: {visual}.",
        "Smooth camera movements, clear visual storytelling.",
    ]
    if voice_prompt:
        prompt_parts.append(f'Narration: "{voice_prompt}"')

    full_prompt = " ".join(prompt_parts)

    return _generate_video(
        prompt=full_prompt,
        duration=min(duration, 15),
        resolution="720p",
        aspect_ratio="16:9",
        generate_audio=True,
    )


# ---------------------------------------------------------------------------
# MCP protocol
# ---------------------------------------------------------------------------

TOOLS = {
    "generate_video": {
        "description": (
            "Generate a video using Seedance 2.0. Supports text-to-video "
            "and image-to-video. Returns a video URL or prediction ID for polling."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "prompt": {"type": "string", "description": "Text prompt describing the video"},
                "duration": {"type": "integer", "description": "Duration in seconds (1-15, -1 for auto)", "default": 5},
                "resolution": {"type": "string", "description": "Video resolution", "default": "720p", "enum": ["480p", "720p", "1080p"]},
                "aspect_ratio": {"type": "string", "description": "Aspect ratio", "default": "16:9", "enum": ["16:9", "9:16", "1:1", "4:3", "3:4", "adaptive"]},
                "generate_audio": {"type": "boolean", "description": "Generate synchronized audio", "default": True},
                "seed": {"type": "integer", "description": "Random seed for reproducibility"},
                "image": {"type": "string", "description": "URL of input image for image-to-video (first frame)"},
                "last_frame_image": {"type": "string", "description": "URL of last frame image"},
            },
            "required": ["prompt"],
        },
    },
    "check_video_status": {
        "description": "Check the status of a Seedance video generation prediction.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "prediction_id": {"type": "string", "description": "The Replicate prediction ID"},
            },
            "required": ["prediction_id"],
        },
    },
    "generate_explainer": {
        "description": (
            "Generate an anime-style explainer video for a topic. "
            "Automatically constructs an optimized prompt with visual style direction."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "topic": {"type": "string", "description": "The topic to explain (e.g. 'Japanese particle は vs が')"},
                "style": {"type": "string", "description": "Visual style", "default": "anime", "enum": ["anime", "manga", "modern", "kawaii"]},
                "duration": {"type": "integer", "description": "Duration in seconds (1-15)", "default": 10},
                "voice_prompt": {"type": "string", "description": "Optional narration/dialogue direction"},
            },
            "required": ["topic"],
        },
    },
}

DISPATCH = {
    "generate_video": lambda args: _generate_video(**args),
    "check_video_status": lambda args: _check_video_status(**args),
    "generate_explainer": lambda args: _generate_explainer(**args),
}


def _handle_request(req: dict) -> dict:
    method = req.get("method", "")
    req_id = req.get("id")

    if method == "initialize":
        return {
            "jsonrpc": "2.0", "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {"listChanged": False}},
                "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
            },
        }

    if method == "notifications/initialized":
        return None  # no response for notifications

    if method == "tools/list":
        tools_list = [
            {"name": name, "description": t["description"], "inputSchema": t["inputSchema"]}
            for name, t in TOOLS.items()
        ]
        return {"jsonrpc": "2.0", "id": req_id, "result": {"tools": tools_list}}

    if method == "tools/call":
        tool_name = req.get("params", {}).get("name", "")
        arguments = req.get("params", {}).get("arguments", {})
        fn = DISPATCH.get(tool_name)
        if not fn:
            return {
                "jsonrpc": "2.0", "id": req_id,
                "error": {"code": -32601, "message": f"Unknown tool: {tool_name}"},
            }
        try:
            result = fn(arguments)
            return {
                "jsonrpc": "2.0", "id": req_id,
                "result": {"content": [{"type": "text", "text": json.dumps(result, indent=2)}]},
            }
        except Exception as exc:
            return {
                "jsonrpc": "2.0", "id": req_id,
                "result": {"content": [{"type": "text", "text": json.dumps({"error": str(exc)})}], "isError": True},
            }

    return {
        "jsonrpc": "2.0", "id": req_id,
        "error": {"code": -32601, "message": f"Method not found: {method}"},
    }


def main():
    """MCP stdio transport loop."""
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except json.JSONDecodeError:
            continue

        resp = _handle_request(req)
        if resp is not None:
            sys.stdout.write(json.dumps(resp) + "\n")
            sys.stdout.flush()


if __name__ == "__main__":
    main()
