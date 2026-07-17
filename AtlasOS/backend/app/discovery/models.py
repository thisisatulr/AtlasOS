from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class NitroToolDefinition(BaseModel):
    name: str = Field(..., description="The type-safe string key identifier for tool execution")
    description: str = Field(..., description="The target behavior description processed by the LLM Planner")
    input_schema: Dict[str, Any] = Field(..., description="The inferred structural properties schema")

class NitroResourceDefinition(BaseModel):
    uri: str = Field(..., description="Uniform Resource Identifier template schema definition")
    name: str
    description: Optional[str] = None
    mime_type: Optional[str] = None

class DiscoveredServer(BaseModel):
    server_id: str
    name: str
    version: str
    transport_type: str = "stdio"
    status: str = "active"
    tools: List[NitroToolDefinition] = Field(default_factory=list)
    resources: List[NitroResourceDefinition] = Field(default_factory=list)