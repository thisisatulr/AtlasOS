import hashlib
from typing import Dict, List, Optional
from app.discovery.models import DiscoveredServer, NitroToolDefinition, NitroResourceDefinition

class NitroStackDiscoveryEngine:
    """
    [✅ Must Have] Coordinates layout tracking using NitroStack runtime 
    primitives to discover local and distributed system interfaces.
    """
    def __init__(self):
        self._registry: Dict[str, DiscoveredServer] = {}
        
        # Fast Hackathon Setup: Simulate external NitroStack manifest files mapping components.
        # This mirrors a real runtime deployment environment.
        self._target_manifests = {
            "github-service": {
                "serverName": "github-mcp-provider",
                "version": "1.4.2",
                "tools": [
                    {
                        "name": "github_read_repository",
                        "description": "Extract file paths, markdown contents, and branch commits from code repositories",
                        "inputSchema": {
                            "type": "object",
                            "properties": {"repo": {"type": "string"}, "path": {"type": "string"}},
                            "required": ["repo"]
                        }
                    }
                ]
            },
            "filesystem-service": {
                "serverName": "file-mcp-provider",
                "version": "2.0.1",
                "tools": [
                    {
                        "name": "fs_read_file",
                        "description": "Read file data block sequences from an absolute path array payload",
                        "inputSchema": {
                            "type": "object",
                            "properties": {"path": {"type": "string"}},
                            "required": ["path"]
                        }
                    }
                ]
            }
        }

    async def discover_servers(self) -> List[DiscoveredServer]:
        """
        Parses active system manifests and returns standardized schema records.
        """
        for key, manifest in self._target_manifests.items():
            server_name = manifest["serverName"]
            version = manifest["version"]
            server_id = hashlib.sha256(f"{server_name}-{version}".encode()).hexdigest()[:16]

            tools_list = [
                NitroToolDefinition(
                    name=t["name"],
                    description=t["description"],
                    input_schema=t["inputSchema"]
                ) for t in manifest.get("tools", [])
            ]

            self._registry[server_id] = DiscoveredServer(
                server_id=server_id,
                name=server_name,
                version=version,
                tools=tools_list,
                resources=[]
            )
            
        return list(self._registry.values())

    def get_server_by_id(self, server_id: str) -> Optional[DiscoveredServer]:
        return self._registry.get(server_id)

    async def clear_and_refresh(self) -> List[DiscoveredServer]:
        self._registry.clear()
        return await self.discover_servers()

discovery_engine = NitroStackDiscoveryEngine()