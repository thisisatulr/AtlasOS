from typing import List
from app.marketplace.models import MarketplacePlugin

class NitroMarketplaceService:
    """
    [✅ Must Have] Manages discovery options for system plugins, suggesting verified 
    MCP components to install when the hypervisor encounters missing capabilities.
    """
    def __init__(self):
        # Quick Hackathon Setup: Pre-populate store metadata tracking values
        self._store_inventory: List[MarketplacePlugin] = [
            MarketplacePlugin(
                name="postgres-mcp-provider",
                description="Enables high-speed transactional SQL operations and schema reporting layers.",
                vendor="Database Labs Core",
                capabilities_provided=["pg_execute_query", "pg_list_tables", "pg_get_schema"],
                install_url="github.com/nitrostack/mcp-postgres",
                is_verified=True,
                popularity_rank=98
            ),
            MarketplacePlugin(
                name="brave-search-mcp",
                description="Provides deep web indexing search loops and structural summary parsers.",
                vendor="Ecosystem OpenSource Team",
                capabilities_provided=["web_search", "fetch_webpage_content"],
                install_url="github.com/nitrostack/mcp-brave-search",
                is_verified=True,
                popularity_rank=92
            )
        ]

    def search_by_keyword(self, keyword: str) -> List[MarketplacePlugin]:
        kw = keyword.lower()
        return [
            item for item in self._store_inventory
            if kw in item.name.lower() or kw in item.description.lower()
        ]

    def recommend_alternatives(self, missing_capability: str) -> List[MarketplacePlugin]:
        """
        Scans marketplace tools to find plugins that can resolve a missing capability.
        """
        matches = [
            item for item in self._store_inventory
            if missing_capability in item.capabilities_provided
        ]
        # Sort recommendations by validation flags and popularity ranks
        return sorted(matches, key=lambda x: (x.is_verified, x.popularity_rank), reverse=True)

marketplace_service = NitroMarketplaceService()