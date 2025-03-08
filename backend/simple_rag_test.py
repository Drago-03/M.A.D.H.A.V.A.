"""
Simple RAG test without LangChain dependencies
"""

import os
import json
import time
from datetime import datetime
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Constants
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSION = 384
DATA_DIR = "data/simple_test"
INDEX_PATH = "data/simple_test/index"

class SimpleDocument:
    """A simple document class."""
    
    def __init__(self, content, source, metadata=None):
        """Initialize a document.
        
        Args:
            content: The document content
            source: The document source
            metadata: Additional metadata
        """
        self.content = content
        self.source = source
        self.metadata = metadata or {}
        self.timestamp = datetime.utcnow().isoformat()
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            "content": self.content,
            "source": self.source,
            "metadata": self.metadata,
            "timestamp": self.timestamp
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create from dictionary."""
        doc = cls(
            content=data["content"],
            source=data["source"],
            metadata=data.get("metadata", {})
        )
        doc.timestamp = data.get("timestamp", datetime.utcnow().isoformat())
        return doc


class SimpleRAG:
    """A simple RAG implementation."""
    
    def __init__(self):
        """Initialize the RAG system."""
        # Create data directory
        os.makedirs(DATA_DIR, exist_ok=True)
        os.makedirs(INDEX_PATH, exist_ok=True)
        
        # Initialize the embedding model
        self.model = SentenceTransformer(EMBEDDING_MODEL)
        
        # Initialize FAISS index
        self.index = faiss.IndexFlatL2(EMBEDDING_DIMENSION)
        
        # Document storage
        self.documents = []
        
        # Load existing documents if any
        self._load_documents()
    
    def _load_documents(self):
        """Load existing documents."""
        try:
            # Load documents
            doc_file = os.path.join(DATA_DIR, "documents.jsonl")
            if os.path.exists(doc_file):
                with open(doc_file, "r") as f:
                    for line in f:
                        try:
                            data = json.loads(line)
                            self.documents.append(SimpleDocument.from_dict(data))
                        except json.JSONDecodeError:
                            continue
            
            # Load index
            index_file = os.path.join(INDEX_PATH, "index.faiss")
            if os.path.exists(index_file):
                self.index = faiss.read_index(index_file)
            
            print(f"Loaded {len(self.documents)} documents")
        except Exception as e:
            print(f"Error loading documents: {str(e)}")
    
    def _save_documents(self):
        """Save documents to disk."""
        try:
            # Save documents
            doc_file = os.path.join(DATA_DIR, "documents.jsonl")
            with open(doc_file, "w") as f:
                for doc in self.documents:
                    f.write(json.dumps(doc.to_dict()) + "\n")
            
            # Save index
            index_file = os.path.join(INDEX_PATH, "index.faiss")
            faiss.write_index(self.index, index_file)
            
            print(f"Saved {len(self.documents)} documents")
        except Exception as e:
            print(f"Error saving documents: {str(e)}")
    
    def add_document(self, content, source, metadata=None):
        """Add a document to the RAG system.
        
        Args:
            content: The document content
            source: The document source
            metadata: Additional metadata
        """
        # Create document
        doc = SimpleDocument(content, source, metadata)
        
        # Add to documents
        self.documents.append(doc)
        
        # Compute embedding
        embedding = self.model.encode([content])[0]
        
        # Add to index
        self.index.add(np.array([embedding]).astype("float32"))
        
        # Save
        self._save_documents()
        
        print(f"Added document: {source}")
    
    def query(self, query_text, k=3):
        """Query the RAG system.
        
        Args:
            query_text: The query text
            k: Number of results to return
            
        Returns:
            Dict containing the answer and metadata
        """
        try:
            # Compute query embedding
            query_embedding = self.model.encode([query_text])[0]
            
            # Search index
            distances, indices = self.index.search(
                np.array([query_embedding]).astype("float32"), 
                min(k, len(self.documents))
            )
            
            # Get results
            results = []
            for i, idx in enumerate(indices[0]):
                if idx < len(self.documents):
                    doc = self.documents[idx]
                    results.append({
                        "content": doc.content,
                        "source": doc.source,
                        "distance": float(distances[0][i])
                    })
            
            # Generate a simple answer (in a real system, this would use an LLM)
            answer = "Based on the retrieved documents, here is the answer:\n\n"
            for i, result in enumerate(results):
                answer += f"{i+1}. {result['content'][:100]}...\n"
            
            return {
                "answer": answer,
                "results": results,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }


def main():
    """Run the simple RAG test."""
    print("Starting simple RAG test...")
    
    # Initialize RAG
    rag = SimpleRAG()
    
    # Add sample documents
    print("\nAdding sample documents...")
    
    rag.add_document(
        content="""
        LangChain is a framework for developing applications powered by language models.
        It provides tools, components, and interfaces that make it easy to build LLM applications.
        """,
        source="LangChain Documentation",
        metadata={"type": "framework"}
    )
    
    rag.add_document(
        content="""
        Retrieval Augmented Generation (RAG) is a technique that enhances large language models
        by retrieving relevant information from external knowledge sources before generating responses.
        """,
        source="AI Research Paper",
        metadata={"type": "technique"}
    )
    
    rag.add_document(
        content="""
        Real-time RAG extends traditional RAG by processing streaming data in real-time.
        This approach enables applications to incorporate the latest information into responses without delay.
        """,
        source="Real-time AI Blog",
        metadata={"type": "technique"}
    )
    
    # Test queries
    print("\nTesting queries...")
    
    queries = [
        "What is LangChain?",
        "What is RAG and why is it useful?",
        "How does real-time RAG differ from traditional RAG?",
        "How can LangChain be used with RAG?"
    ]
    
    for query in queries:
        print(f"\nQuery: {query}")
        result = rag.query(query)
        print(json.dumps(result, indent=2))
    
    print("\nTest completed!")


if __name__ == "__main__":
    main() 