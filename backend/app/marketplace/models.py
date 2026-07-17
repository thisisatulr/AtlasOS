from typing import List, Optional
from pydantic import BaseModel, Field

class MarketplacePlugin(BaseModel):
    name: str = Field(..., description="The registry identification string of the external server package")
    description: str
    vendor: str
    capabilities_provided: List[str] = Field(..., description="List of explicit tool names this plugin unlocks")
    install_url: str = Field(..., description="Target repository or package installation locator string")
    is_verified: bool = Field(default=False)
    popularity_rank: int = Field(default=50)
    version: str = "1.0.0"