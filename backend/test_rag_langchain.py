"""
Test script for the LangChain-only RAG pipeline
"""

import asyncio
import json
import os
from realtime_rag_langchain import RAGOrchestrator

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
    
    # Document about Real-time RAG
    await orchestrator.add_document(
        content="""
        Real-time RAG extends traditional RAG by processing streaming data in real-time.
        This approach enables applications to incorporate the latest information into responses
        without delay. Key features of real-time RAG include:
        - Continuous ingestion of new documents
        - Dynamic updating of vector indices
        - Event-driven processing architecture
        - Low-latency retrieval and generation
        Real-time RAG is particularly valuable for applications requiring up-to-date information,
        such as news analysis, financial insights, and customer support.
        """,
        source="Real-time AI Blog",
        domain="test",
        metadata={"type": "technique", "category": "streaming"}
    )
    
    # Wait for documents to be processed
    print("Waiting for documents to be processed...")
    await asyncio.sleep(5)
    
    # Test queries
    print("\nTesting queries...")
    
    # Query about LangChain
    print("\nQuery: What is LangChain and what are its key components?")
    result = await orchestrator.process_query(
        "What is LangChain and what are its key components?",
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
    
    # Query about Real-time RAG
    print("\nQuery: How does real-time RAG differ from traditional RAG?")
    result = await orchestrator.process_query(
        "How does real-time RAG differ from traditional RAG?",
        domain="test"
    )
    print(json.dumps(result, indent=2))
    
    # Query combining topics
    print("\nQuery: How can LangChain be used to implement real-time RAG?")
    result = await orchestrator.process_query(
        "How can LangChain be used to implement real-time RAG?",
        domain="test"
    )
    print(json.dumps(result, indent=2))
    
    # Stop the orchestrator
    print("\nStopping the orchestrator...")
    await orchestrator.stop()
    
    print("Test completed!")

if __name__ == "__main__":
    asyncio.run(test_rag_pipeline()) 