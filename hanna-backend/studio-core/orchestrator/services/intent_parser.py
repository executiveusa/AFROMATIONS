import re
from dataclasses import dataclass, field


@dataclass
class ParsedIntent:
    action: str
    entities: dict[str, str]
    tools_needed: list[str]
    style: str = "anime"
    raw_message: str = ""


_FULL_PIPELINE_TOOLS = [
    "generate_image",
    "generate_voice",
    "lip_sync_character",
    "compose_scene",
    "render_video",
]

_IMAGE_ONLY_TOOLS = ["generate_image"]
_VOICE_ONLY_TOOLS = ["generate_voice"]
_VIDEO_ONLY_TOOLS = ["generate_video"]
_SCENE_TOOLS = ["generate_image", "generate_voice", "compose_scene", "render_video"]

_STYLE_KEYWORDS: dict[str, str] = {
    "anime": "anime",
    "manga": "manga",
    "realistic": "realistic",
    "cartoon": "cartoon",
    "cinematic": "cinematic",
    "pixel": "pixel_art",
    "watercolor": "watercolor",
    "sketch": "sketch",
}

_EMOTION_KEYWORDS: dict[str, str] = {
    "dramatic": "dramatic",
    "angry": "angry",
    "sad": "sad",
    "happy": "happy",
    "excited": "excited",
    "calm": "calm",
    "fierce": "fierce",
    "determined": "determined",
    "mysterious": "mysterious",
}

_CHARACTER_KEYWORDS = [
    "warrior", "hero", "villain", "samurai", "ninja", "mage", "princess",
    "king", "queen", "soldier", "assassin", "dragon", "spirit",
]


class IntentParser:
    def parse(self, message: str) -> ParsedIntent:
        lower = message.lower()
        entities: dict[str, str] = {}

        # Detect style
        style = "anime"
        for kw, s in _STYLE_KEYWORDS.items():
            if kw in lower:
                style = s
                break

        # Detect emotion
        for kw, emotion in _EMOTION_KEYWORDS.items():
            if kw in lower:
                entities["emotion"] = emotion
                break

        # Detect character type
        for char in _CHARACTER_KEYWORDS:
            if char in lower:
                entities["character"] = char
                break

        # Extract dialogue/text hints (quoted or after "say"/"saying"/"speak")
        dialogue_match = re.search(r'"([^"]+)"', message)
        if dialogue_match:
            entities["dialogue"] = dialogue_match.group(1)
        else:
            say_match = re.search(r"(?:say(?:ing)?|speak(?:ing)?|shout(?:ing)?)\s+(.+?)(?:\.|$)", lower)
            if say_match:
                entities["dialogue"] = say_match.group(1).strip()

        # Determine action and tools
        wants_scene = any(kw in lower for kw in ["scene", "video", "create", "make", "produce", "film"])
        wants_voice = any(kw in lower for kw in ["voice", "speak", "say", "audio", "sound", "dialogue"])
        wants_image = any(kw in lower for kw in ["image", "picture", "draw", "art", "portrait", "render"])
        wants_lip_sync = wants_voice and any(kw in lower for kw in ["lip", "animate", "sync", "character"])

        if wants_scene and wants_voice:
            action = "create_scene"
            tools = _FULL_PIPELINE_TOOLS
        elif wants_scene and not wants_voice:
            action = "create_scene_no_voice"
            tools = _SCENE_TOOLS
        elif wants_voice and not wants_scene:
            action = "generate_voice"
            tools = _VOICE_ONLY_TOOLS
        elif wants_image and not wants_scene:
            action = "generate_image"
            tools = _IMAGE_ONLY_TOOLS
        else:
            # Default: full pipeline
            action = "create_scene"
            tools = _FULL_PIPELINE_TOOLS

        # Build a prompt from the message for the generation tools
        entities["prompt"] = message
        if "character" not in entities:
            entities["character"] = "warrior"
        if "dialogue" not in entities:
            entities["dialogue"] = f"I am {entities.get('character', 'a warrior')}. My will is unbreakable."

        return ParsedIntent(
            action=action,
            entities=entities,
            tools_needed=tools,
            style=style,
            raw_message=message,
        )
