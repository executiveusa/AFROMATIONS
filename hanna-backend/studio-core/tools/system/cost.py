from credits.manager import estimate_dag_cost, get_tool_cost
from tools.registry import ToolInput, ToolRegistry, ToolSchema


async def handle_estimate_cost(inputs: dict) -> dict:
    tool_names: list[str] = inputs.get("tool_names", [])
    breakdown = {name: get_tool_cost(name) for name in tool_names}
    total = estimate_dag_cost(tool_names)
    return {
        "total_credits": total,
        "breakdown": breakdown,
        "tool_count": len(tool_names),
    }


_schema = ToolSchema(
    name="estimate_cost",
    description="Estimate the total credit cost for a list of tools.",
    inputs=[
        ToolInput(name="tool_names", type="array", description="List of tool names to cost"),
    ],
    outputs=[
        ToolInput(name="total_credits", type="number", description="Total estimated cost in credits"),
        ToolInput(name="breakdown", type="object", description="Per-tool cost breakdown"),
    ],
    cost_credits=0.0,
    queue="generation",
)

ToolRegistry.register(_schema, handle_estimate_cost)
