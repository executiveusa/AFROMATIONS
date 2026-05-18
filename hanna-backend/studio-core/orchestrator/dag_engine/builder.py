import uuid
from dataclasses import dataclass, field
from typing import Any, Optional

import networkx as nx


@dataclass
class DAGNode:
    id: str
    tool: str
    inputs: dict[str, Any]
    depends_on: list[str] = field(default_factory=list)
    retry_limit: int = 3
    status: str = "pending"
    outputs: dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "tool": self.tool,
            "inputs": self.inputs,
            "depends_on": self.depends_on,
            "retry_limit": self.retry_limit,
            "status": self.status,
            "outputs": self.outputs,
            "error": self.error,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "DAGNode":
        return cls(
            id=data["id"],
            tool=data["tool"],
            inputs=data.get("inputs", {}),
            depends_on=data.get("depends_on", []),
            retry_limit=data.get("retry_limit", 3),
            status=data.get("status", "pending"),
            outputs=data.get("outputs", {}),
            error=data.get("error"),
        )


@dataclass
class DAGWorkflow:
    id: str
    nodes: list[DAGNode]

    def _build_graph(self) -> nx.DiGraph:
        g = nx.DiGraph()
        for node in self.nodes:
            g.add_node(node.id)
        for node in self.nodes:
            for dep in node.depends_on:
                g.add_edge(dep, node.id)
        return g

    def topological_order(self) -> list[DAGNode]:
        g = self._build_graph()
        if not nx.is_directed_acyclic_graph(g):
            raise ValueError("Workflow contains a cycle")
        order = list(nx.topological_sort(g))
        node_map = {n.id: n for n in self.nodes}
        return [node_map[nid] for nid in order if nid in node_map]

    def get_node(self, node_id: str) -> Optional[DAGNode]:
        return next((n for n in self.nodes if n.id == node_id), None)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nodes": [n.to_dict() for n in self.nodes],
        }

    @classmethod
    def from_dict(cls, data: dict) -> "DAGWorkflow":
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            nodes=[DAGNode.from_dict(n) for n in data.get("nodes", [])],
        )

    @property
    def tool_names(self) -> list[str]:
        return [n.tool for n in self.nodes]
