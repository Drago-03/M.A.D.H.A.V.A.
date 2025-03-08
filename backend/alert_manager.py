import asyncio
import json
import websockets
from typing import Dict, Any, List
from datetime import datetime
from dataclasses import dataclass, asdict

@dataclass
class Alert:
    type: str
    message: str
    domain: str
    timestamp: str
    metadata: Dict[str, Any]

class AlertManager:
    def __init__(self):
        self.alerts: List[Alert] = []
        self.clients = set()
        self.domain_thresholds = {
            'finance': {
                'market_volatility': 0.15,  # 15% change
                'volume_spike': 2.0,  # 2x normal volume
            },
            'legal': {
                'case_urgency': 0.8,  # 80% urgency score
                'compliance_risk': 0.7,  # 70% risk score
            },
            'education': {
                'engagement_drop': 0.3,  # 30% drop in engagement
                'progress_threshold': 0.9,  # 90% completion
            },
            'code': {
                'security_risk': 0.8,  # 80% security risk score
                'performance_drop': 0.4,  # 40% performance drop
            },
            'medical': {
                'confidence_threshold': 0.95,  # 95% confidence required
                'risk_level': 0.7,  # 70% risk level
            },
            'customerSupport': {
                'satisfaction_drop': 0.2,  # 20% drop in satisfaction
                'response_time': 300,  # 5 minutes max response time
            },
            'travel': {
                'price_change': 0.25,  # 25% price change
                'availability': 0.1,  # 10% availability remaining
            },
            'realEstate': {
                'price_change': 0.1,  # 10% price change
                'market_shift': 0.15,  # 15% market condition change
            }
        }

    async def start_websocket_server(self):
        async def handler(websocket, path):
            self.clients.add(websocket)
            try:
                await websocket.wait_closed()
            finally:
                self.clients.remove(websocket)

        server = await websockets.serve(handler, "localhost", 8765)
        await server.wait_closed()

    async def broadcast_alert(self, alert: Alert):
        if not self.clients:
            return
        
        message = json.dumps(asdict(alert))
        await asyncio.gather(
            *[client.send(message) for client in self.clients]
        )

    async def send_alert(self, type: str, message: str, metadata: Dict[str, Any]):
        alert = Alert(
            type=type,
            message=message,
            domain=metadata.get('domain', 'general'),
            timestamp=datetime.utcnow().isoformat(),
            metadata=metadata
        )
        self.alerts.append(alert)
        await self.broadcast_alert(alert)

    def check_thresholds(self, domain: str, metrics: Dict[str, Any]):
        thresholds = self.domain_thresholds.get(domain, {})
        alerts = []

        if domain == 'finance':
            if metrics.get('volatility', 0) > thresholds['market_volatility']:
                alerts.append({
                    'type': 'market_volatility',
                    'message': f"High market volatility detected: {metrics['volatility']}",
                    'domain': domain
                })

        elif domain == 'legal':
            if metrics.get('risk_score', 0) > thresholds['compliance_risk']:
                alerts.append({
                    'type': 'compliance_risk',
                    'message': f"High compliance risk detected: {metrics['risk_score']}",
                    'domain': domain
                })

        elif domain == 'medical':
            if metrics.get('confidence', 0) < thresholds['confidence_threshold']:
                alerts.append({
                    'type': 'low_confidence',
                    'message': f"Low confidence in medical analysis: {metrics['confidence']}",
                    'domain': domain
                })

        elif domain == 'customerSupport':
            if metrics.get('response_time', 0) > thresholds['response_time']:
                alerts.append({
                    'type': 'slow_response',
                    'message': f"Response time exceeding threshold: {metrics['response_time']}s",
                    'domain': domain
                })

        return alerts

    def get_alert_history(self) -> List[Dict[str, Any]]:
        return [asdict(alert) for alert in self.alerts]