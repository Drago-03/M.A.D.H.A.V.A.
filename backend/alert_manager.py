from typing import List, Dict, Any
import asyncio
import json
import websockets
from datetime import datetime

class AlertManager:
    def __init__(self):
        self.websocket_connections: List[websockets.WebSocketServerProtocol] = []
        self.alert_history: List[Dict[str, Any]] = []
        
    async def start_websocket_server(self):
        async def handler(websocket):
            self.websocket_connections.append(websocket)
            try:
                async for message in websocket:
                    # Handle incoming messages if needed
                    pass
            finally:
                self.websocket_connections.remove(websocket)
                
        async with websockets.serve(handler, "localhost", 8765):
            await asyncio.Future()  # run forever
            
    async def send_alert(self, alert_type: str, message: str, data: Dict[str, Any]):
        alert = {
            "type": alert_type,
            "message": message,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.alert_history.append(alert)
        
        # Send to all connected clients
        websockets_to_remove = []
        for ws in self.websocket_connections:
            try:
                await ws.send(json.dumps(alert))
            except websockets.exceptions.ConnectionClosed:
                websockets_to_remove.append(ws)
                
        # Clean up closed connections
        for ws in websockets_to_remove:
            self.websocket_connections.remove(ws)
            
    def get_alert_history(self) -> List[Dict[str, Any]]:
        return self.alert_history