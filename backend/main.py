from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import pathway as pw
import asyncio
import uvicorn

from embeddings import EmbeddingStore
from llm import LLM
from metrics_extractor import MetricsExtractor
from alert_manager import AlertManager

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
embedding_store = EmbeddingStore()
llm = LLM()
metrics_extractor = MetricsExtractor()
alert_manager = AlertManager()

class QueryRequest(BaseModel):
    query: str
    filters: Optional[dict] = None

class QueryResponse(BaseModel):
    answer: str
    context: List[str]
    sources: List[str]
    timestamp: str
    metrics: Optional[Dict[str, Any]] = None

@app.post("/query")
async def query(request: QueryRequest) -> QueryResponse:
    try:
        # Get relevant documents from FAISS
        results = embedding_store.similarity_search(request.query)
        
        # Format context for LLM
        context = [
            {"text": text, "source": source}
            for text, source, _ in results
        ]
        
        # Generate response using LLM
        answer = await llm.generate_response(request.query, context)
        
        # Extract financial metrics if present
        metrics = None
        if any(keyword in request.query.lower() for keyword in ['metrics', 'financial', 'numbers']):
            metrics_data = {}
            for text, _, _ in results:
                extracted = metrics_extractor.extract_metrics(text)
                for field, value in extracted.__dict__.items():
                    if value is not None:
                        metrics_data[field] = value
            if metrics_data:
                metrics = metrics_data
                
                # Send alert if significant metrics are found
                await alert_manager.send_alert(
                    "metrics_found",
                    "New financial metrics detected in query",
                    metrics_data
                )
        
        return QueryResponse(
            answer=answer,
            context=[text for text, _, _ in results],
            sources=[source for _, source, _ in results],
            timestamp=datetime.utcnow().isoformat(),
            metrics=metrics
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts")
async def get_alerts():
    return alert_manager.get_alert_history()

# Pathway data processing pipeline
def setup_pathway_pipeline():
    with pw.Config.interactive():
        # Input table for financial data
        input_table = pw.io.fs.read(
            "data/*.jsonl",
            mode="streaming",
            format="json"
        )
        
        # Process and index new documents
        def process_document(doc):
            embedding_store.add_texts(
                [doc["content"]],
                [doc["source"]]
            )
            
            # Extract and alert on new financial metrics
            metrics = metrics_extractor.extract_metrics(doc["content"])
            if any(value is not None for value in metrics.__dict__.values()):
                asyncio.create_task(
                    alert_manager.send_alert(
                        "new_document_metrics",
                        f"New financial metrics found in document from {doc['source']}",
                        metrics.__dict__
                    )
                )
            return doc
        
        processed = input_table.select(process_document)
        processed.run()

if __name__ == "__main__":
    # Start WebSocket server for alerts
    asyncio.create_task(alert_manager.start_websocket_server())
    
    # Start Pathway pipeline
    asyncio.create_task(setup_pathway_pipeline())
    
    # Run FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000)