import uuid

from orchestrator.dag_engine.builder import DAGNode, DAGWorkflow
from orchestrator.services.intent_parser import ParsedIntent


class ToolSelector:
    def select(self, intent: ParsedIntent) -> list[str]:
        return intent.tools_needed

    def build_dag(self, intent: ParsedIntent, job_id: str) -> DAGWorkflow:
        tools = self.select(intent)
        prompt = intent.entities.get("prompt", intent.raw_message)
        character = intent.entities.get("character", "warrior")
        dialogue = intent.entities.get("dialogue", f"I am {character}. My will is unbreakable.")
        emotion = intent.entities.get("emotion", "neutral")
        style = intent.style

        nodes: list[DAGNode] = []
        node_ids: dict[str, str] = {}

        def _node_id(tool: str) -> str:
            return f"{tool}_{len(nodes)}"

        if "generate_image" in tools:
            nid = _node_id("generate_image")
            node_ids["generate_image"] = nid
            nodes.append(DAGNode(
                id=nid,
                tool="generate_image",
                inputs={
                    "prompt": f"{character} in {style} style, {emotion} expression, {prompt}",
                    "style": style,
                    "width": 1024,
                    "height": 1024,
                },
            ))

        if "generate_video" in tools and "generate_image" not in tools:
            nid = _node_id("generate_video")
            node_ids["generate_video"] = nid
            nodes.append(DAGNode(
                id=nid,
                tool="generate_video",
                inputs={
                    "prompt": f"{character} animated in {style} style, {prompt}",
                    "style": style,
                    "duration_seconds": 5.0,
                    "fps": 24,
                },
            ))

        if "generate_voice" in tools:
            nid = _node_id("generate_voice")
            node_ids["generate_voice"] = nid
            nodes.append(DAGNode(
                id=nid,
                tool="generate_voice",
                inputs={
                    "text": dialogue,
                    "character": character,
                    "emotion": emotion,
                    "speed": 1.0,
                },
            ))

        if "lip_sync_character" in tools:
            nid = _node_id("lip_sync_character")
            node_ids["lip_sync_character"] = nid
            img_ref = f"$ref:{node_ids['generate_image']}.image_url" if "generate_image" in node_ids else ""
            aud_ref = f"$ref:{node_ids['generate_voice']}.audio_url" if "generate_voice" in node_ids else ""
            deps = [v for k, v in node_ids.items() if k in ("generate_image", "generate_voice")]
            nodes.append(DAGNode(
                id=nid,
                tool="lip_sync_character",
                inputs={
                    "image_url": img_ref,
                    "audio_url": aud_ref,
                    "character": character,
                },
                depends_on=deps,
            ))

        if "compose_scene" in tools:
            nid = _node_id("compose_scene")
            node_ids["compose_scene"] = nid
            img_ref = f"$ref:{node_ids['generate_image']}.image_url" if "generate_image" in node_ids else ""
            aud_ref = f"$ref:{node_ids['generate_voice']}.audio_url" if "generate_voice" in node_ids else ""
            vid_ref = (
                f"$ref:{node_ids['lip_sync_character']}.video_url"
                if "lip_sync_character" in node_ids
                else ""
            )
            deps = [v for k, v in node_ids.items() if k in ("generate_image", "generate_voice", "lip_sync_character")]
            nodes.append(DAGNode(
                id=nid,
                tool="compose_scene",
                inputs={
                    "image_url": img_ref,
                    "audio_url": aud_ref,
                    "video_url": vid_ref,
                    "title": f"{character.title()} Scene",
                    "duration": 5.0,
                },
                depends_on=deps,
            ))

        if "render_video" in tools:
            nid = _node_id("render_video")
            node_ids["render_video"] = nid
            scene_ref = (
                f"$ref:{node_ids['compose_scene']}.scene_data"
                if "compose_scene" in node_ids
                else {}
            )
            deps = [node_ids["compose_scene"]] if "compose_scene" in node_ids else []
            nodes.append(DAGNode(
                id=nid,
                tool="render_video",
                inputs={
                    "scene_data": scene_ref,
                    "output_format": "mp4",
                    "resolution": "1080p",
                },
                depends_on=deps,
            ))

        return DAGWorkflow(id=job_id, nodes=nodes)
