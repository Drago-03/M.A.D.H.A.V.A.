import requests
from typing import List, Dict, Any

class LLM:
    def __init__(self, model: str = "mistral"):
        self.model = model
        self.api_url = "http://localhost:11434/api/generate"
        
    async def generate_response(self, query: str, context: List[Dict[str, Any]]) -> str:
        # Format context for the prompt
        context_str = "\n".join([
            f"Source ({item['source']}): {item['text']}"
            for item in context
        ])
        
        prompt = f"""You are a financial analysis AI assistant. Use the following context to answer the question. 
If you cannot answer the question based on the context, say so.

Context:
{context_str}

Question: {query}

Answer:"""

        response = requests.post(
            self.api_url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code != 200:
            raise Exception("Failed to get response from LLM")
            
        return response.json()["response"]