from collections.abc import Callable
from typing import Any, Optional

from pydantic import BaseModel


class ToolInput(BaseModel):
    name: str
    type: str  # "string", "number", "boolean", "object", "array"
    description: str
    required: bool = True
    default: Any = None


class ToolSchema(BaseModel):
    name: str
    description: str
    inputs: list[ToolInput]
    outputs: list[ToolInput]
    cost_credits: float
    queue: str  # "generation" or "composition"

    model_config = {"arbitrary_types_allowed": True}

    # Handler stored separately (not serialized)
    _handler: Optional[Callable] = None

    def set_handler(self, fn: Callable) -> None:
        self._handler = fn

    def get_handler(self) -> Callable:
        if self._handler is None:
            raise RuntimeError(f"No handler registered for tool '{self.name}'")
        return self._handler


class ToolRegistry:
    _tools: dict[str, ToolSchema] = {}

    @classmethod
    def register(cls, schema: ToolSchema, handler: Callable) -> None:
        schema.set_handler(handler)
        cls._tools[schema.name] = schema

    @classmethod
    def get(cls, name: str) -> ToolSchema:
        schema = cls._tools.get(name)
        if schema is None:
            raise KeyError(f"Tool '{name}' not found in registry")
        return schema

    @classmethod
    def list_tools(cls) -> list[dict]:
        return [
            {
                "name": s.name,
                "description": s.description,
                "inputs": [i.model_dump() for i in s.inputs],
                "outputs": [o.model_dump() for o in s.outputs],
                "cost_credits": s.cost_credits,
                "queue": s.queue,
            }
            for s in cls._tools.values()
        ]

    @classmethod
    def validate_inputs(cls, tool_name: str, inputs: dict) -> dict:
        schema = cls.get(tool_name)
        validated: dict[str, Any] = {}
        for field in schema.inputs:
            if field.name in inputs:
                validated[field.name] = inputs[field.name]
            elif not field.required and field.default is not None:
                validated[field.name] = field.default
            elif field.required:
                raise ValueError(f"Missing required input '{field.name}' for tool '{tool_name}'")
        return validated

    @classmethod
    def get_handler(cls, tool_name: str) -> Callable:
        return cls.get(tool_name).get_handler()

    @classmethod
    def all_names(cls) -> list[str]:
        return list(cls._tools.keys())
