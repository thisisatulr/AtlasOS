import asyncio
import json
import sys
from typing import Dict, Any, Optional

class LowLevelMCPClient:
    """
    Fast, low-overhead Stdio transport handler for MCP connectivity.
    Bypasses complex dependencies to meet strict hackathon build timelines.
    """
    def __init__(self, command: str, args: list[str]):
        self.command = command
        self.args = args
        self._process: Optional[asyncio.subprocess.Process] = None

    async def connect(self) -> bool:
        try:
            self._process = await asyncio.create_subprocess_exec(
                self.command,
                *self.args,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.DEVNULL
            )
            return True
        except Exception as e:
            print(f"Failed to boot target MCP server via command: {self.command}. Reason: {e}", file=sys.stderr)
            return False

    async def call_method(self, method: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self._process or not self._process.stdin or not self._process.stdout:
            return None
        
        request_payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params
        }
        
        try:
            raw_send = json.dumps(request_payload) + "\n"
            self._process.stdin.write(raw_send.encode())
            await self._process.stdin.drain()
            
            raw_response = await self._process.stdout.readline()
            if not raw_response:
                return None
                
            return json.loads(raw_response.decode())
        except Exception:
            return None

    async def close(self):
        if self._process:
            try:
                self._process.terminate()
                await self._process.wait()
            except Exception:
                pass