"""
User routes for M.A.D.H.A.V.A
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime
import os

# Create router
router = APIRouter()

# Models
class UserProfile(BaseModel):
    email: str
    name: Optional[str] = None
    preferences: Optional[dict] = None

class QueryHistoryItem(BaseModel):
    query: str
    domain: str
    timestamp: str
    answer: str
    sources: List[str]

# Routes
@router.get("/profile")
async def get_user_profile(email: str):
    """Get user profile."""
    try:
        # In a real app, this would fetch from a database
        # For now, we'll return a mock profile
        return {
            "email": email,
            "name": "Demo User",
            "preferences": {
                "default_domain": "finance",
                "theme": "light"
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User profile not found: {str(e)}"
        )

@router.post("/profile")
async def update_user_profile(profile: UserProfile):
    """Update user profile."""
    try:
        # In a real app, this would update a database
        # For now, we'll just return the profile
        return profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.get("/history")
async def get_query_history(email: str):
    """Get user query history."""
    try:
        # In a real app, this would fetch from a database
        # For now, we'll return mock data
        history = []
        
        # Try to read from a file if it exists
        history_file = f"data/query_history_{email.replace('@', '_at_')}.jsonl"
        if os.path.exists(history_file):
            with open(history_file, "r") as f:
                for line in f:
                    try:
                        history.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
        
        # If no history, return some mock data
        if not history:
            history = [
                {
                    "query": "What are the latest financial regulations?",
                    "domain": "finance",
                    "timestamp": (datetime.utcnow().isoformat()),
                    "answer": "The latest financial regulations include...",
                    "sources": ["Bloomberg API", "Financial Times"]
                },
                {
                    "query": "How do I implement a RAG pipeline?",
                    "domain": "code",
                    "timestamp": (datetime.utcnow().isoformat()),
                    "answer": "To implement a RAG pipeline, you need to...",
                    "sources": ["LangChain Docs", "Pinecone Blog"]
                }
            ]
        
        return {"history": history}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch history: {str(e)}"
        )

@router.post("/history")
async def add_query_to_history(item: QueryHistoryItem, email: str):
    """Add a query to the user's history."""
    try:
        # In a real app, this would save to a database
        # For now, we'll append to a file
        history_file = f"data/query_history_{email.replace('@', '_at_')}.jsonl"
        os.makedirs("data", exist_ok=True)
        
        with open(history_file, "a") as f:
            f.write(json.dumps(item.dict()) + "\n")
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save query: {str(e)}"
        ) 