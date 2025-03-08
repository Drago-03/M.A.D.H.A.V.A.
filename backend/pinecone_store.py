"""
Pinecone Vector Store Integration for M.A.D.H.A.V.A
"""

import os
import json
import time
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# Load environment variables
load_dotenv()

# Check if Pinecone is available, otherwise use a mock implementation
try:
    import pinecone
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False
    print("Pinecone package not found. Using mock implementation.")

# Constants
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSION = 384
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "madhava-index")


class Document:
    """A document class for storing content and metadata."""
    
    def __init__(self, content: str, source: str, metadata: Optional[Dict[str, Any]] = None):
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
        self.id = f"{int(time.time())}-{hash(content) % 10000}"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "id": self.id,
            "content": self.content,
            "source": self.source,
            "metadata": self.metadata,
            "timestamp": self.timestamp
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Document':
        """Create from dictionary."""
        doc = cls(
            content=data["content"],
            source=data["source"],
            metadata=data.get("metadata", {})
        )
        doc.timestamp = data.get("timestamp", datetime.utcnow().isoformat())
        doc.id = data.get("id", f"{int(time.time())}-{hash(doc.content) % 10000}")
        return doc


class PineconeStore:
    """Vector store using Pinecone for real-time document retrieval."""
    
    def __init__(self, namespace: str = "default"):
        """Initialize the Pinecone store.
        
        Args:
            namespace: The namespace for this store
        """
        self.namespace = namespace
        self.embedding_model = SentenceTransformer(EMBEDDING_MODEL)
        
        # Initialize Pinecone if available
        if PINECONE_AVAILABLE and PINECONE_API_KEY and PINECONE_ENVIRONMENT:
            try:
                pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
                
                # Check if index exists, if not create it
                if PINECONE_INDEX_NAME not in pinecone.list_indexes():
                    pinecone.create_index(
                        name=PINECONE_INDEX_NAME,
                        dimension=EMBEDDING_DIMENSION,
                        metric="cosine"
                    )
                
                self.index = pinecone.Index(PINECONE_INDEX_NAME)
                self.use_pinecone = True
                print(f"Connected to Pinecone index: {PINECONE_INDEX_NAME}")
            except Exception as e:
                print(f"Error connecting to Pinecone: {str(e)}")
                self.use_pinecone = False
                self._init_mock_store()
        else:
            self.use_pinecone = False
            self._init_mock_store()
    
    def _init_mock_store(self):
        """Initialize a mock store when Pinecone is not available."""
        self.documents = {}
        self.embeddings = {}
        print("Using mock vector store")
    
    def add_documents(self, documents: List[Document]) -> None:
        """Add documents to the vector store.
        
        Args:
            documents: List of documents to add
        """
        if not documents:
            return
        
        # Compute embeddings for all documents
        contents = [doc.content for doc in documents]
        embeddings = self.embedding_model.encode(contents)
        
        if self.use_pinecone:
            # Prepare vectors for Pinecone
            vectors = []
            for i, doc in enumerate(documents):
                vector = {
                    "id": doc.id,
                    "values": embeddings[i].tolist(),
                    "metadata": {
                        "content": doc.content,
                        "source": doc.source,
                        "timestamp": doc.timestamp,
                        **doc.metadata
                    }
                }
                vectors.append(vector)
            
            # Upsert vectors to Pinecone
            self.index.upsert(vectors=vectors, namespace=self.namespace)
            print(f"Added {len(documents)} documents to Pinecone namespace: {self.namespace}")
        else:
            # Add to mock store
            for i, doc in enumerate(documents):
                self.documents[doc.id] = doc
                self.embeddings[doc.id] = embeddings[i]
            print(f"Added {len(documents)} documents to mock store namespace: {self.namespace}")
    
    def add_document(self, content: str, source: str, metadata: Optional[Dict[str, Any]] = None) -> Document:
        """Add a single document to the vector store.
        
        Args:
            content: The document content
            source: The document source
            metadata: Additional metadata
            
        Returns:
            The added document
        """
        doc = Document(content, source, metadata)
        self.add_documents([doc])
        return doc
    
    def similarity_search(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """Search for documents similar to the query.
        
        Args:
            query: The query text
            k: Number of results to return
            
        Returns:
            List of documents with similarity scores
        """
        # Compute query embedding
        query_embedding = self.embedding_model.encode([query])[0]
        
        if self.use_pinecone:
            # Search in Pinecone
            results = self.index.query(
                vector=query_embedding.tolist(),
                top_k=k,
                namespace=self.namespace,
                include_metadata=True
            )
            
            # Format results
            formatted_results = []
            for match in results.matches:
                formatted_results.append({
                    "id": match.id,
                    "content": match.metadata.get("content", ""),
                    "source": match.metadata.get("source", ""),
                    "score": match.score,
                    "metadata": {k: v for k, v in match.metadata.items() 
                               if k not in ["content", "source"]}
                })
            
            return formatted_results
        else:
            # Search in mock store
            if not self.embeddings:
                return []
            
            # Calculate cosine similarity
            results = []
            for doc_id, embedding in self.embeddings.items():
                doc = self.documents[doc_id]
                similarity = np.dot(query_embedding, embedding) / (
                    np.linalg.norm(query_embedding) * np.linalg.norm(embedding)
                )
                results.append({
                    "id": doc_id,
                    "content": doc.content,
                    "source": doc.source,
                    "score": float(similarity),
                    "metadata": doc.metadata
                })
            
            # Sort by similarity score and return top k
            results.sort(key=lambda x: x["score"], reverse=True)
            return results[:k]
    
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document from the vector store.
        
        Args:
            doc_id: The document ID to delete
            
        Returns:
            True if successful, False otherwise
        """
        if self.use_pinecone:
            try:
                self.index.delete(ids=[doc_id], namespace=self.namespace)
                return True
            except Exception as e:
                print(f"Error deleting document from Pinecone: {str(e)}")
                return False
        else:
            if doc_id in self.documents:
                del self.documents[doc_id]
                del self.embeddings[doc_id]
                return True
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the vector store.
        
        Returns:
            Dictionary with statistics
        """
        if self.use_pinecone:
            try:
                stats = self.index.describe_index_stats()
                namespace_stats = stats.get("namespaces", {}).get(self.namespace, {})
                return {
                    "total_vector_count": stats.get("total_vector_count", 0),
                    "namespace_count": namespace_stats.get("vector_count", 0),
                    "dimension": stats.get("dimension", EMBEDDING_DIMENSION),
                    "index_name": PINECONE_INDEX_NAME,
                    "namespace": self.namespace
                }
            except Exception as e:
                print(f"Error getting Pinecone stats: {str(e)}")
                return {"error": str(e)}
        else:
            return {
                "total_vector_count": len(self.documents),
                "namespace_count": len(self.documents),
                "dimension": EMBEDDING_DIMENSION,
                "index_name": "mock_index",
                "namespace": self.namespace
            }


# Example usage
if __name__ == "__main__":
    # Initialize store
    store = PineconeStore(namespace="test")
    
    # Add documents
    store.add_document(
        content="Retrieval Augmented Generation (RAG) is a technique that enhances large language models by retrieving relevant information from external knowledge sources before generating responses.",
        source="AI Research Paper",
        metadata={"type": "technique", "category": "language models"}
    )
    
    store.add_document(
        content="Pinecone is a vector database that makes it easy to build high-performance vector search applications.",
        source="Pinecone Documentation",
        metadata={"type": "tool", "category": "vector database"}
    )
    
    # Search
    results = store.similarity_search("What is RAG?", k=2)
    
    # Print results
    for i, result in enumerate(results):
        print(f"Result {i+1} (Score: {result['score']:.4f}):")
        print(f"Content: {result['content']}")
        print(f"Source: {result['source']}")
        print(f"Metadata: {result['metadata']}")
        print()
    
    # Get stats
    stats = store.get_stats()
    print(f"Vector Store Stats: {json.dumps(stats, indent=2)}") 