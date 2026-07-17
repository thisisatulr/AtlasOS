from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class CapabilityRecord(BaseModel):
    id: str = Field(..., description="Unique deterministic identifier for tracking mapping arrays")
    name: str = Field(..., description="The functional tool action locator lookup key")
    description: str
    server_id: str = Field(..., description="Reference hash pointing back to the owning source provider")
    input_schema: Dict[str, Any]
    tags: List[str] = Field(default_factory=list)
    
    # [✅ Must Have] Hackathon Ranking Engine Performance Metrics
    trust_score: float = Field(default=1.0, description="Evaluated security metric bound [0.0 - 1.0]")
    latency_estimate_ms: int = Field(default=120, description="Simulated execution speed delay factor")
    popularity_index: int = Field(default=100, description="Ecosystem utilization tracking frequency count")
    status: str = "healthy"  # healthy, degraded, offline