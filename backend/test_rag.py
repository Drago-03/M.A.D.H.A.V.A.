"""
Test script for the real-time RAG pipeline
"""

import asyncio
import json
import os
from realtime_rag import RAGOrchestrator

async def test_rag_pipeline():
    """Test the RAG pipeline with sample documents and queries."""
    print("Starting RAG pipeline test...")
    
    # Initialize the orchestrator
    orchestrator = RAGOrchestrator()
    await orchestrator.start()
    
    # Create test data directory if it doesn't exist
    os.makedirs("data/test", exist_ok=True)
    
    # Add sample documents
    print("Adding sample documents...")
    
    # Document about Pathway
    await orchestrator.add_document(
        content="""
        Pathway is a high-performance data processing framework for streaming and event-driven applications.
        It enables real-time data processing with Python and provides seamless integration with machine learning models.
        Pathway's core features include:
        - Real-time data processing
        - Event-driven architecture
        - Python-native API
        - High throughput and low latency
        - Integration with ML frameworks
        """,
        source="Pathway Documentation",
        domain="test",
        metadata={"type": "framework", "category": "data processing"}
    )
    
    # Document about LangChain
    await orchestrator.add_document(
        content="""
        LangChain is a framework for developing applications powered by language models.
        It provides tools, components, and interfaces that make it easy to build LLM applications.
        LangChain's key components include:
        - Chains: Combine multiple components for specific tasks
        - Agents: Let LLMs decide which actions to take
        - Memory: Store and retrieve conversation history
        - Retrievers: Find relevant information from external sources
        - Callbacks: Log and stream intermediate steps
        """,
        source="LangChain Documentation",
        domain="test",
        metadata={"type": "framework", "category": "language models"}
    )
    
    # Document about RAG
    await orchestrator.add_document(
        content="""
        Retrieval Augmented Generation (RAG) is a technique that enhances large language models by retrieving
        relevant information from external knowledge sources before generating responses.
        RAG combines the strengths of retrieval-based and generation-based approaches:
        - Improves factual accuracy by grounding responses in retrieved information
        - Reduces hallucinations by providing context
        - Enables access to domain-specific knowledge
        - Allows for real-time updates without retraining the model
        """,
        source="AI Research Paper",
        domain="test",
        metadata={"type": "technique", "category": "language models"}
    )
    
    # Wait for documents to be processed
    print("Waiting for documents to be processed...")
    await asyncio.sleep(5)
    
    # Test queries
    print("\nTesting queries...")
    
    # Query about Pathway
    print("\nQuery: What is Pathway and what are its key features?")
    result = await orchestrator.process_query(
        "What is Pathway and what are its key features?",
        domain="test"
    )
    print(json.dumps(result, indent=2))
    
    # Query about LangChain
    print("\nQuery: Explain LangChain and its components.")
    result = await orchestrator.process_query(
        "Explain LangChain and its components.",
        domain="test"
    )
    print(json.dumps(result, indent=2))
    
    # Query about RAG
    print("\nQuery: What is RAG and why is it useful?")
    result = await orchestrator.process_query(
        "What is RAG and why is it useful?",
        domain="test"
    )
    print(json.dumps(result, indent=2))
    
    # Query combining topics
    print("\nQuery: How can Pathway and LangChain be used together for RAG applications?")
    result = await orchestrator.process_query(
        "How can Pathway and LangChain be used together for RAG applications?",
        domain="test"
    )
    print(json.dumps(result, indent=2))
    
    # Stop the orchestrator
    print("\nStopping the orchestrator...")
    await orchestrator.stop()
    
    print("Test completed!")

if __name__ == "__main__":
    asyncio.run(test_rag_pipeline()) 