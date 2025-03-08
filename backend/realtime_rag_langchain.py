"""
Real-time RAG Pipeline using LangChain
This module implements a real-time RAG (Retrieval Augmented Generation) pipeline
that processes streaming data and provides context-enhanced responses.
"""

import os
import json
import time
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import threading

from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Import your LLM implementation
from llm import LLM

# Constants
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
INDEX_PATH = "data/vector_index"

class FileWatcher:
    """Watches for new files in a directory and processes them."""
    
    def __init__(self, directory: str, callback, interval: int = 5):
        """Initialize the file watcher.
        
        Args:
            directory: The directory to watch
            callback: The callback function to call when new files are found
            interval: The interval in seconds to check for new files
        """
        self.directory = directory
        self.callback = callback
        self.interval = interval
        self.processed_files = set()
        self.running = False
        self.thread = None
    
    def start(self):
        """Start watching for new files."""
        self.running = True
        self.thread = threading.Thread(target=self._watch)
        self.thread.daemon = True
        self.thread.start()
    
    def stop(self):
        """Stop watching for new files."""
        self.running = False
        if self.thread:
            self.thread.join(timeout=1)
    
    def _watch(self):
        """Watch for new files and process them."""
        while self.running:
            try:
                # Get all files in the directory
                if os.path.exists(self.directory):
                    files = [os.path.join(self.directory, f) for f in os.listdir(self.directory) 
                             if os.path.isfile(os.path.join(self.directory, f)) and f.endswith('.jsonl')]
                    
                    # Process new files
                    new_files = [f for f in files if f not in self.processed_files]
                    if new_files:
                        self.callback(new_files)
                        self.processed_files.update(new_files)
            except Exception as e:
                print(f"Error watching directory {self.directory}: {str(e)}")
            
            # Sleep for the specified interval
            time.sleep(self.interval)


class RealTimeRAGPipeline:
    """Real-time RAG pipeline using LangChain."""
    
    def __init__(self, domain: str = "default"):
        """Initialize the RAG pipeline.
        
        Args:
            domain: The domain for this RAG pipeline
        """
        self.domain = domain
        self.index_path = f"{INDEX_PATH}/{domain}"
        os.makedirs(self.index_path, exist_ok=True)
        
        # Initialize the embeddings model
        self.embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
        
        # Initialize the vector store
        if os.path.exists(os.path.join(self.index_path, "index.faiss")):
            self.vector_store = FAISS.load_local(self.index_path, self.embeddings)
        else:
            # Create empty index with a placeholder document
            self.vector_store = FAISS.from_documents(
                [Document(page_content="Placeholder", metadata={"source": "init"})],
                self.embeddings
            )
            self.vector_store.save_local(self.index_path)
        
        # Initialize the LLM
        self.llm = LLM().get_llm()
        
        # Set up the RAG chain
        self.setup_rag_chain()
        
        # Set up the file watcher
        self.setup_file_watcher()
    
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
            {"context": self.vector_store.as_retriever(), "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
    
    def setup_file_watcher(self):
        """Set up the file watcher to monitor for new documents."""
        data_dir = f"data/{self.domain}"
        os.makedirs(data_dir, exist_ok=True)
        
        self.file_watcher = FileWatcher(
            directory=data_dir,
            callback=self.process_new_files
        )
        self.file_watcher.start()
    
    def process_new_files(self, files: List[str]):
        """Process new files and add them to the vector store.
        
        Args:
            files: List of file paths to process
        """
        documents = []
        
        for file_path in files:
            try:
                with open(file_path, 'r') as f:
                    for line in f:
                        try:
                            doc = json.loads(line)
                            metadata = doc.get("metadata", {}) or {}
                            metadata["source"] = doc["source"]
                            metadata["timestamp"] = doc["timestamp"]
                            
                            documents.append(
                                Document(
                                    page_content=doc["content"],
                                    metadata=metadata
                                )
                            )
                        except json.JSONDecodeError:
                            continue
            except Exception as e:
                print(f"Error processing file {file_path}: {str(e)}")
        
        if documents:
            # Add documents to the vector store
            self.update_index(documents)
    
    def update_index(self, documents: List[Document]):
        """Update the vector index with new documents.
        
        Args:
            documents: List of documents to add to the index
        """
        if documents:
            # Create a new vector store with the documents
            new_vector_store = FAISS.from_documents(documents, self.embeddings)
            
            # Merge with the existing vector store
            self.vector_store.merge_from(new_vector_store)
            
            # Save the updated vector store
            self.vector_store.save_local(self.index_path)
            
            print(f"Added {len(documents)} documents to the vector store for domain {self.domain}")
    
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
            docs = self.vector_store.similarity_search(query_text, k=3)
            
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
    
    def close(self):
        """Close the RAG pipeline."""
        if hasattr(self, 'file_watcher'):
            self.file_watcher.stop()


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
        
        # Close all pipelines
        for pipeline in self.pipelines.values():
            pipeline.close()


# Example usage
if __name__ == "__main__":
    async def main():
        # Initialize the orchestrator
        orchestrator = RAGOrchestrator()
        await orchestrator.start()
        
        # Add some sample documents
        await orchestrator.add_document(
            content="LangChain is a framework for developing applications powered by language models.",
            source="LangChain Documentation",
            domain="test"
        )
        
        await orchestrator.add_document(
            content="Retrieval Augmented Generation (RAG) enhances LLMs by retrieving relevant information before generating responses.",
            source="AI Research Paper",
            domain="test"
        )
        
        # Wait for documents to be processed
        await asyncio.sleep(5)
        
        # Query the RAG pipeline
        result = await orchestrator.process_query(
            "What is RAG and how does it relate to LangChain?",
            domain="test"
        )
        
        print(json.dumps(result, indent=2))
        
        # Stop the orchestrator
        await orchestrator.stop()
    
    # Run the example
    asyncio.run(main()) 