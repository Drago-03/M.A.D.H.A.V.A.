from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
import asyncio
import uvicorn
import json
import os

from embeddings import EmbeddingStore
from llm import LLM
from metrics_extractor import MetricsExtractor
from alert_manager import AlertManager
from domain_processors import DomainProcessor

app = FastAPI(title="ANAND - Advanced Neural Assistance for Numerous Domain Intelligence")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
embedding_stores = {
    "finance": EmbeddingStore(namespace="finance"),
    "healthcare": EmbeddingStore(namespace="healthcare"),
    "legal": EmbeddingStore(namespace="legal"),
    "news": EmbeddingStore(namespace="news"),
    "ecommerce": EmbeddingStore(namespace="ecommerce"),
    "education": EmbeddingStore(namespace="education"),
    "code": EmbeddingStore(namespace="code"),
    "hr": EmbeddingStore(namespace="hr"),
    "travel": EmbeddingStore(namespace="travel"),
    "science": EmbeddingStore(namespace="science"),
    "cybersecurity": EmbeddingStore(namespace="cybersecurity"),
    "knowledge": EmbeddingStore(namespace="knowledge"),
    "realestate": EmbeddingStore(namespace="realestate"),
    "fitness": EmbeddingStore(namespace="fitness"),
    "support": EmbeddingStore(namespace="support")
}

llm = LLM()
metrics_extractor = MetricsExtractor()
alert_manager = AlertManager()
domain_processor = DomainProcessor()

class QueryRequest(BaseModel):
    query: str
    domain: Literal["finance", "healthcare", "legal", "news", "ecommerce", 
                   "education", "code", "hr", "travel", "science", 
                   "cybersecurity", "knowledge", "realestate", "fitness", "support"]
    user_id: Optional[str] = None
    filters: Optional[dict] = None

class QueryResponse(BaseModel):
    answer: str
    context: List[str]
    sources: List[str]
    timestamp: str
    metrics: Optional[Dict[str, Any]] = None
    domain_specific_data: Optional[Dict[str, Any]] = None

@app.post("/api/query")
async def process_query(request: QueryRequest) -> QueryResponse:
    try:
        processor_method = getattr(domain_processor, f"process_{request.domain}", None)
        if not processor_method:
            raise HTTPException(status_code=400, detail=f"Unsupported domain: {request.domain}")

        result = await processor_method(request.query)
        
        # Add domain-specific processing here
        if request.domain == 'finance':
            # Additional Bloomberg data processing
            result['domain_specific_data'] = {
                'real_time_data': True,
                'data_source': 'Bloomberg Terminal'
            }
        elif request.domain == 'legal':
            # Additional CourtListener processing
            result['domain_specific_data'] = {
                'api_version': 'v4',
                'data_source': 'CourtListener'
            }
        
        result['timestamp'] = datetime.utcnow().isoformat()
        
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts")
async def get_alerts():
    return alert_manager.get_alert_history()

@app.get("/user/{user_id}/history")
async def get_user_history(user_id: str):
    try:
        history = []
        try:
            with open(f"data/query_history_{user_id}.jsonl", "r") as f:
                for line in f:
                    history.append(json.loads(line))
        except FileNotFoundError:
            # No history yet
            pass
        
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_documents():
    """Process documents from each domain directory."""
    for domain in embedding_stores.keys():
        domain_dir = f"data/{domain}"
        os.makedirs(domain_dir, exist_ok=True)
        
        try:
            # Process all JSON files in the domain directory
            for filename in os.listdir(domain_dir):
                if filename.endswith('.jsonl'):
                    file_path = os.path.join(domain_dir, filename)
                    with open(file_path, 'r') as f:
                        for line in f:
                            try:
                                doc = json.loads(line)
                                embedding_stores[domain].add_texts(
                                    [doc["content"]],
                                    [doc["source"]],
                                    [doc.get("metadata", {})]
                                )
                                
                                # Domain-specific processing
                                if domain == "legal" and any(term in doc["content"].lower() 
                                    for term in ["risk", "compliance", "regulation"]):
                                    await alert_manager.send_alert(
                                        "legal_update",
                                        f"New legal document requiring review from {doc['source']}",
                                        {"preview": doc["content"][:200] + "..."}
                                    )
                                elif domain == "cybersecurity" and any(term in doc["content"].lower() 
                                    for term in ["vulnerability", "threat", "exploit"]):
                                    await alert_manager.send_alert(
                                        "security_alert",
                                        f"New security threat detected from {doc['source']}",
                                        {"preview": doc["content"][:200] + "..."}
                                    )
                            except json.JSONDecodeError:
                                continue
        except Exception as e:
            print(f"Error processing documents for domain {domain}: {str(e)}")

if __name__ == "__main__":
    import asyncio

    async def main():
        for domain in embedding_stores.keys():
            os.makedirs(f"data/{domain}", exist_ok=True)

        await asyncio.gather(
            alert_manager.start_websocket_server(),
            process_documents()
        )

    loop = asyncio.get_event_loop()
    loop.create_task(main())

    uvicorn.run(app, host="0.0.0.0", port=8000)