"""
Hana Agent — the primary AI coordinator for AFROMATIONS Studio Core.

Hana parses natural language requests, decomposes them into tool-driven
DAG workflows, estimates costs, and provides human-readable explanations.
"""
from credits.manager import estimate_dag_cost
from orchestrator.dag_engine.builder import DAGWorkflow
from orchestrator.services.intent_parser import IntentParser, ParsedIntent
from orchestrator.services.tool_selector import ToolSelector

import uuid


class HanaAgent:
    def __init__(self) -> None:
        self._parser = IntentParser()
        self._selector = ToolSelector()

    def parse(self, message: str) -> ParsedIntent:
        return self._parser.parse(message)

    def build_workflow(self, message: str, job_id: str | None = None) -> DAGWorkflow:
        if job_id is None:
            job_id = str(uuid.uuid4())
        intent = self._parser.parse(message)
        return self._selector.build_dag(intent, job_id)

    def process(self, message: str) -> dict:
        """
        Full pre-flight analysis: parse → select → build DAG → estimate cost.

        Returns a dict ready for the orchestrator to act on.
        """
        job_id = str(uuid.uuid4())
        intent = self._parser.parse(message)
        workflow = self._selector.build_dag(intent, job_id)
        cost = estimate_dag_cost(workflow.tool_names)

        return {
            "job_id": job_id,
            "intent": {
                "action": intent.action,
                "style": intent.style,
                "entities": intent.entities,
            },
            "tools": workflow.tool_names,
            "dag": workflow.to_dict(),
            "estimated_cost_credits": cost,
            "explanation": self.explain(workflow, intent),
        }

    def explain(self, workflow: DAGWorkflow, intent: ParsedIntent | None = None) -> str:
        """Return a human-readable explanation of what Hana will execute."""
        steps = " → ".join(
            f"{n.tool.replace('_', ' ').title()}" for n in workflow.topological_order()
        )
        character = (intent.entities.get("character", "character") if intent else "character")
        style = (intent.style if intent else "anime")
        cost = estimate_dag_cost(workflow.tool_names)

        return (
            f"I'll create a {style}-style scene featuring your {character}. "
            f"Pipeline: {steps}. "
            f"Estimated cost: {cost:.1f} credits."
        )


# Singleton
hana = HanaAgent()
