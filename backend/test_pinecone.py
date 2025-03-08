"""
Test script for Pinecone integration
"""

import os
from dotenv import load_dotenv
from pinecone_store import PineconeStore, Document

# Load environment variables
load_dotenv()

def test_pinecone_integration():
    """Test Pinecone integration."""
    print("Testing Pinecone integration...")
    
    # Initialize store
    store = PineconeStore(namespace="test")
    
    # Add test documents
    print("\nAdding test documents...")
    
    doc1 = store.add_document(
        content="Pinecone is a vector database that makes it easy to build high-performance vector search applications.",
        source="Pinecone Documentation",
        metadata={"type": "tool", "category": "vector database"}
    )
    
    doc2 = store.add_document(
        content="Retrieval Augmented Generation (RAG) is a technique that enhances large language models by retrieving relevant information from external knowledge sources before generating responses.",
        source="AI Research Paper",
        metadata={"type": "technique", "category": "language models"}
    )
    
    doc3 = store.add_document(
        content="M.A.D.H.A.V.A is a powerful real-time RAG system that processes streaming data across multiple domains to provide context-enhanced responses.",
        source="M.A.D.H.A.V.A Documentation",
        metadata={"type": "application", "category": "RAG"}
    )
    
    # Get stats
    print("\nVector store stats:")
    stats = store.get_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    # Test search
    print("\nTesting similarity search...")
    
    queries = [
        "What is Pinecone?",
        "Explain RAG",
        "Tell me about M.A.D.H.A.V.A"
    ]
    
    for query in queries:
        print(f"\nQuery: {query}")
        results = store.similarity_search(query, k=1)
        
        if results:
            result = results[0]
            print(f"  Score: {result['score']:.4f}")
            print(f"  Content: {result['content']}")
            print(f"  Source: {result['source']}")
        else:
            print("  No results found")
    
    # Test deletion
    if hasattr(doc1, 'id'):
        print(f"\nDeleting document: {doc1.id}")
        success = store.delete_document(doc1.id)
        print(f"  Deletion {'successful' if success else 'failed'}")
        
        # Verify deletion
        print("\nVerifying deletion...")
        results = store.similarity_search("What is Pinecone?", k=1)
        if results:
            result = results[0]
            print(f"  Found: {result['content']}")
        else:
            print("  Document successfully deleted")
    
    print("\nTest completed!")

if __name__ == "__main__":
    test_pinecone_integration() 