"""
Real-time RAG Pipeline using Pathway and LangChain
This module implements a real-time RAG (Retrieval Augmented Generation) pipeline
that processes streaming data and provides context-enhanced responses.
"""

import os
import json
import time
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

import pathway as pw
from pathway.stdlib.ml.index import KNNIndex

from langchain.chains import RetrievalQAWithSourcesChain
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.retrievers import BaseRetriever

# Import your LLM implementation
from llm import LLM

# Constants
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSION = 384
INDEX_PATH = "data/vector_index"

class PathwayRetriever(BaseRetriever):
    """Custom retriever that uses Pathway for real-time document retrieval."""
    
    def __init__(self, embedding_model, index_path, k=3):
        """Initialize the PathwayRetriever.
        
        Args:
            embedding_model: The embedding model to use
            index_path: Path to the vector index
            k: Number of documents to retrieve
        """
        self.embedding_model = embedding_model
        self.index_path = index_path
        self.k = k
        self.embeddings = HuggingFaceEmbeddings(model_name=embedding_model)
        
        # Initialize FAISS index if it exists
        if os.path.exists(index_path):
            self.vector_store = FAISS.load_local(index_path, self.embeddings)
        else:
            # Create empty index
            self.vector_store = FAISS.from_documents(
                [Document(page_content="Placeholder", metadata={"source": "init"})],
                self.embeddings
            )
            self.vector_store.save_local(index_path)
    
    def _get_relevant_documents(self, query: str) -> List[Document]:
        """Get documents relevant to the query."""
        return self.vector_store.similarity_search(query, k=self.k)
    
    async def _aget_relevant_documents(self, query: str) -> List[Document]:
        """Asynchronously get documents relevant to the query."""
        return self.vector_store.similarity_search(query, k=self.k)
    
    def update_index(self, documents: List[Document]):
        """Update the vector index with new documents."""
        if documents:
            new_vector_store = FAISS.from_documents(documents, self.embeddings)
            self.vector_store.merge_from(new_vector_store)
            self.vector_store.save_local(self.index_path)


class RealTimeRAGPipeline:
    """Real-time RAG pipeline using Pathway and LangChain."""
    
    def __init__(self, domain: str = "default"):
        """Initialize the RAG pipeline.
        
        Args:
            domain: The domain for this RAG pipeline
        """
        self.domain = domain
        self.index_path = f"{INDEX_PATH}/{domain}"
        os.makedirs(self.index_path, exist_ok=True)
        
        # Initialize the retriever
        self.retriever = PathwayRetriever(
            embedding_model=EMBEDDING_MODEL,
            index_path=self.index_path
        )
        
        # Initialize the LLM
        self.llm = LLM().get_llm()
        
        # Set up the RAG chain
        self.setup_rag_chain()
        
        # Set up the Pathway pipeline
        self.setup_pathway_pipeline()
    
    def setup_rag_chain(self):
        """Set up the RAG chain using LangChain."""
        # Define the prompt template
        template = """
        Answer the question based on the following context:
        
        {context}
        
        Question: {question}
        
        Answer:
        """
        
        prompt = PromptTemplate.from_template(template)
        
        # Create the RAG chain
        self.chain = (
            {"context": self.retriever, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
    
    def setup_pathway_pipeline(self):
        """Set up the Pathway data processing pipeline."""
        class InputSchema(pw.Schema):
            content: str
            source: str
            timestamp: str
            metadata: Optional[Dict[str, Any]]
        
        # Define the Pathway pipeline
        with pw.Config.interactive():
            # Input data stream
            input_stream = pw.io.fs.read(
                f"data/{self.domain}/*.jsonl",
                mode="streaming",
                format="json",
                schema=InputSchema,
            )
            
            # Process documents
            documents = input_stream.select(
                pw.this.content,
                pw.this.source,
                pw.this.timestamp,
                pw.this.metadata,
            )
            
            # Compute embeddings
            embeddings = documents.select(
                content=pw.this.content,
                source=pw.this.source,
                timestamp=pw.this.timestamp,
                metadata=pw.this.metadata,
                embedding=pw.ml.huggingface.embedding(
                    pw.this.content,
                    model=EMBEDDING_MODEL,
                    batch_size=32
                )
            )
            
            # Create KNN index
            index = KNNIndex(
                embeddings.embedding,
                embeddings,
                n_neighbors=5,
                include_distances=True
            )
            
            # Output indexed documents to be added to the retriever
            indexed_docs = embeddings.select(
                content=pw.this.content,
                source=pw.this.source,
                timestamp=pw.this.timestamp,
                metadata=pw.this.metadata
            )
            
            # Handle document updates
            def process_document_updates(docs_batch):
                documents = []
                for doc in docs_batch:
                    metadata = doc.get("metadata", {}) or {}
                    metadata["source"] = doc["source"]
                    metadata["timestamp"] = doc["timestamp"]
                    
                    documents.append(
                        Document(
                            page_content=doc["content"],
                            metadata=metadata
                        )
                    )
                
                if documents:
                    self.retriever.update_index(documents)
            
            # Connect to document updates
            indexed_docs.sink(
                pw.io.python.call(process_document_updates),
                batch_size=10,
                time_window=5
            )
            
            # Run the pipeline
            pw.run()
    
    async def query(self, query_text: str) -> Dict[str, Any]:
        """Query the RAG pipeline.
        
        Args:
            query_text: The query text
            
        Returns:
            Dict containing the answer and metadata
        """
        try:
            # Get the answer from the RAG chain
            answer = await self.chain.ainvoke(query_text)
            
            # Get the retrieved documents for context
            docs = await self.retriever._aget_relevant_documents(query_text)
            
            # Format the response
            sources = [doc.metadata.get("source", "unknown") for doc in docs]
            context = [doc.page_content for doc in docs]
            
            return {
                "answer": answer,
                "context": context,
                "sources": sources,
                "timestamp": datetime.utcnow().isoformat(),
                "metrics": {
                    "retrieval_time_ms": int(time.time() * 1000),
                    "num_docs_retrieved": len(docs)
                }
            }
        except Exception as e:
            return {
                "answer": f"Error processing query: {str(e)}",
                "context": [],
                "sources": [],
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e)
            }


# Event-driven agent orchestration
class RAGOrchestrator:
    """Orchestrates multiple domain-specific RAG pipelines."""
    
    def __init__(self):
        """Initialize the RAG orchestrator."""
        self.pipelines = {}
        self.event_queue = asyncio.Queue()
        self.running = False
    
    def get_pipeline(self, domain: str) -> RealTimeRAGPipeline:
        """Get or create a domain-specific pipeline.
        
        Args:
            domain: The domain for the pipeline
            
        Returns:
            The RAG pipeline for the specified domain
        """
        if domain not in self.pipelines:
            self.pipelines[domain] = RealTimeRAGPipeline(domain=domain)
        return self.pipelines[domain]
    
    async def process_query(self, query: str, domain: str) -> Dict[str, Any]:
        """Process a query using the appropriate pipeline.
        
        Args:
            query: The query text
            domain: The domain for the query
            
        Returns:
            The query result
        """
        pipeline = self.get_pipeline(domain)
        result = await pipeline.query(query)
        
        # Add the event to the queue for logging/monitoring
        await self.event_queue.put({
            "type": "query",
            "domain": domain,
            "query": query,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return result
    
    async def add_document(self, content: str, source: str, domain: str, metadata: Optional[Dict[str, Any]] = None):
        """Add a document to the appropriate pipeline.
        
        Args:
            content: The document content
            source: The document source
            domain: The domain for the document
            metadata: Additional metadata
        """
        # Create the document file
        os.makedirs(f"data/{domain}", exist_ok=True)
        timestamp = datetime.utcnow().isoformat()
        
        document = {
            "content": content,
            "source": source,
            "timestamp": timestamp,
            "metadata": metadata or {}
        }
        
        # Write to the domain's data directory
        with open(f"data/{domain}/{int(time.time())}.jsonl", "a") as f:
            f.write(json.dumps(document) + "\n")
        
        # Add the event to the queue
        await self.event_queue.put({
            "type": "document_added",
            "domain": domain,
            "source": source,
            "timestamp": timestamp
        })
    
    async def start_event_processor(self):
        """Start processing events from the queue."""
        self.running = True
        while self.running:
            try:
                event = await self.event_queue.get()
                # Process the event (e.g., log it, trigger alerts, etc.)
                print(f"Event processed: {event['type']} in domain {event['domain']}")
                self.event_queue.task_done()
            except Exception as e:
                print(f"Error processing event: {str(e)}")
    
    async def start(self):
        """Start the orchestrator."""
        # Start the event processor
        asyncio.create_task(self.start_event_processor())
    
    async def stop(self):
        """Stop the orchestrator."""
        self.running = False
        # Wait for all events to be processed
        await self.event_queue.join()


# Example usage
if __name__ == "__main__":
    async def main():
        # Initialize the orchestrator
        orchestrator = RAGOrchestrator()
        await orchestrator.start()
        
        # Add some sample documents
        await orchestrator.add_document(
            content="Pathway is a high-performance data processing framework for streaming and event-driven applications.",
            source="Pathway Documentation",
            domain="code"
        )
        
        await orchestrator.add_document(
            content="LangChain is a framework for developing applications powered by language models.",
            source="LangChain Documentation",
            domain="code"
        )
        
        # Wait for documents to be processed
        await asyncio.sleep(5)
        
        # Query the RAG pipeline
        result = await orchestrator.process_query(
            "What is Pathway and how does it relate to LangChain?",
            domain="code"
        )
        
        print(json.dumps(result, indent=2))
        
        # Stop the orchestrator
        await orchestrator.stop()
    
    # Run the example
    asyncio.run(main()) 