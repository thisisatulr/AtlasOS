import hashlib
from typing import List, Optional, Dict
from app.capabilities.models import CapabilityRecord
from app.discovery.models import DiscoveredServer

class NitroCapabilityRegistry:
    """
    Acts as the hypervisor memory map, orchestrating resource index lookups,
    performance evaluations, and structural sorting algorithms.
    """
    def __init__(self):
        self._capabilities: Dict[str, CapabilityRecord] = {}

    def register_server_capabilities(self, server: DiscoveredServer):
        """
        Parses all structural tools inside a NitroStack target 
        and indexes them as operational system capabilities.
        """
        for tool in server.tools:
            # Create a unique tracking key for this capability assignment
            cap_id = hashlib.sha256(f"{server.server_id}-{tool.name}".encode()).hexdigest()[:12]
            
            # Simple Hackathon heuristics assignment logic based on component names
            inferred_tags = ["system"]
            assigned_latency = 150
            if "github" in tool.name:
                inferred_tags = ["network", "vcs", "code"]
                assigned_latency = 450
            elif "fs" in tool.name:
                inferred_tags = ["disk", "io", "local"]
                assigned_latency = 45

            record = CapabilityRecord(
                id=cap_id,
                name=tool.name,
                description=tool.description,
                server_id=server.server_id,
                input_schema=tool.input_schema,
                tags=inferred_tags,
                latency_estimate_ms=assigned_latency,
                trust_score=0.98 if "github" in tool.name else 1.0
            )
            self._capabilities[cap_id] = record

    def list_all(self) -> List[CapabilityRecord]:
        return list(self._capabilities.values())

    def find_by_name(self, name: str) -> List[CapabilityRecord]:
        return [cap for cap in self._capabilities.values() if cap.name == name]

    def select_optimal_capability(self, tool_name: str) -> Optional[CapabilityRecord]:
        """
        [✅ Must Have] Sorting Algorithm. Filters options by name and ranks 
        them based on trust, latency, and status to return the best match.
        """
        matches = self.find_by_name(tool_name)
        if not matches:
            return None
            
        # Prioritize healthy nodes first, then optimize for high trust and low latency
        sorted_matches = sorted(
            matches,
            key=lambda x: (x.status == "healthy", x.trust_score, -x.latency_estimate_ms),
            reverse=True
        )
        return sorted_matches[0]

capability_registry = NitroCapabilityRegistry()