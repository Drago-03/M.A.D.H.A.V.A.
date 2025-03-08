from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Literal
import asyncio
import json
from datetime import datetime
import uvicorn

from backend.embeddings import EmbeddingStore
from backend.metrics_extractor import MetricsExtractor
from backend.alert_manager import AlertManager

app = FastAPI(
    title="M.A.D.H.A.V.A.",
    description="Multi-domain Analytical Data Harvesting & Automated Verification Assistant",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Domain = Literal['finance', 'healthcare', 'legal', 'news', 'ecommerce']

# Initialize components with refined domains
embeddings = {
    'finance': EmbeddingStore(namespace='finance'),
    'healthcare': EmbeddingStore(namespace='healthcare'),
    'legal': EmbeddingStore(namespace='legal'),
    'news': EmbeddingStore(namespace='news'),
    'ecommerce': EmbeddingStore(namespace='ecommerce')
}

metrics_extractor = MetricsExtractor()
alert_manager = AlertManager()

class QueryRequest(BaseModel):
    query: str
    domain: Domain
    user_id: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

class QueryResponse(BaseModel):
    answer: str
    context: List[str]
    sources: List[str]
    metrics: Optional[Dict[str, Any]] = None
    domain_specific_data: Optional[Dict[str, Any]] = None
    timestamp: str = datetime.utcnow().isoformat()

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        # Get relevant context from domain-specific embeddings
        if request.domain not in embeddings:
            raise HTTPException(status_code=400, detail=f"Invalid domain: {request.domain}")
            
        context_results = embeddings[request.domain].similarity_search(
            request.query,
            k=3,
            metadata_filters=request.filters
        )

        context = [result[0] for result in context_results]
        sources = [result[1] for result in context_results]
        
        # Extract metrics based on domain and context
        metrics = {}
        for text in context:
            domain_metrics = metrics_extractor.extract_domain_metrics(text, request.domain)
            metrics.update(domain_metrics)
        
        # For now, return a simple response
        # In production, this would go through the LLM pipeline
        response = {
            "answer": f"Here is the answer for your {request.domain} query: {request.query}",
            "context": context,
            "sources": sources,
            "metrics": metrics if metrics else None,
            "domain_specific_data": {},  # Would be populated by domain-specific processors
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Generate any relevant alerts
        if metrics:
            await alert_manager.send_alert(
                f"{request.domain}_alert",
                f"New insights available for {request.domain}",
                {"domain": request.domain, **metrics}
            )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    alert_manager.connections.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        alert_manager.connections.remove(websocket)

@app.get("/alerts")
async def get_alerts(
    domain: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = 50
):
    return alert_manager.get_alert_history(domain, severity, limit)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)