# M.A.D.H.A.V.A

**Multi-domain Analytical Data Harvesting & Automated Verification Assistant**

![M.A.D.H.A.V.A Logo](backend/static/images/logo.svg)

M.A.D.H.A.V.A is a powerful real-time RAG (Retrieval Augmented Generation) system that processes streaming data across multiple domains to provide context-enhanced responses. It combines the strengths of vector databases, large language models, and domain-specific APIs to deliver accurate and up-to-date information.

## Features

- **Real-time Data Processing**: Continuously ingest and process streaming data
- **Multi-domain Support**: Specialized processing for finance, legal, healthcare, code, and more
- **Vector Search with Pinecone**: High-performance similarity search using Pinecone vector database
- **Event-driven Architecture**: Process events asynchronously for improved performance
- **Domain-specific APIs**: Integrate with specialized APIs for enhanced responses
- **LangChain Integration**: Leverage LangChain components for advanced RAG pipelines
- **Modern UI**: Clean, responsive interface for easy interaction

## Architecture

M.A.D.H.A.V.A follows a modular architecture with the following components:

1. **Vector Store**: Uses Pinecone for efficient vector similarity search
2. **Embedding Models**: Sentence transformers for high-quality document embeddings
3. **LLM Integration**: Connects to various LLMs through a unified interface
4. **Domain Processors**: Specialized processors for different knowledge domains
5. **Event Queue**: Asynchronous event processing for real-time updates
6. **API Handlers**: Integration with external domain-specific APIs
7. **Web Interface**: Modern, responsive UI for user interaction

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 14+ (for frontend)
- Docker (optional, for containerized deployment)
- Pinecone API key (for vector database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/madhava.git
   cd madhava
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. Run the backend server:
   ```bash
   python server.py
   ```

5. Access the application:
   Open your browser and navigate to `http://localhost:8000`

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t madhava .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 -e PINECONE_API_KEY=your_api_key madhava
   ```

## Pinecone Integration

M.A.D.H.A.V.A uses Pinecone as its vector database for efficient similarity search. To set up Pinecone:

1. Create a Pinecone account at [pinecone.io](https://www.pinecone.io/)
2. Create a new index with dimension 384 (for the default embedding model)
3. Add your Pinecone API key to the `.env` file:
   ```
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=madhava-index
   ```

## Domain-specific Processing

M.A.D.H.A.V.A supports multiple domains with specialized processing:

- **Finance**: Integration with financial data APIs and market analysis
- **Legal**: Legal document analysis and regulatory information
- **Healthcare**: Medical information and healthcare data processing
- **Code**: Programming assistance and code analysis
- **Education**: Educational content and learning resources
- **Travel**: Travel planning and recommendations
- **Real Estate**: Property analysis and market insights

To add a new domain, extend the `DomainProcessor` class with a new domain-specific method.

## API Reference

### Authentication

- `POST /login`: Authenticate with email and Pinecone API key
- `GET /logout`: Log out the current user
- `POST /token`: OAuth2 compatible token endpoint

### Query Endpoints

- `POST /api/query`: Process a query with domain-specific context
- `GET /api/user/{user_id}/history`: Get query history for a user
- `GET /alerts`: Get system alerts

### Vector Store Operations

- `POST /api/documents`: Add documents to the vector store
- `GET /api/documents`: List documents in the vector store
- `DELETE /api/documents/{doc_id}`: Delete a document from the vector store
- `GET /api/stats`: Get vector store statistics

## Development

### Project Structure

```
madhava/
├── backend/
│   ├── static/           # Static assets
│   ├── templates/        # HTML templates
│   ├── routes/           # API route handlers
│   ├── models/           # Data models
│   ├── pinecone_store.py # Pinecone integration
│   ├── realtime_rag.py   # RAG implementation
│   ├── domain_processors.py # Domain-specific processing
│   ├── api_handlers.py   # External API integration
│   ├── server.py         # Main server file
│   └── requirements.txt  # Python dependencies
├── docs/                 # Documentation
├── tests/                # Test suite
└── README.md             # This file
```

### Adding a New Domain

1. Add a new domain processor method in `domain_processors.py`:
   ```python
   async def process_new_domain(self, query: str) -> Dict[str, Any]:
       # Domain-specific processing
       domain_data = await self.api_handler.query_domain_api(query)
       
       # Use RAG to enhance the response
       rag_result = await self.rag_orchestrator.process_query(query, domain="new_domain")
       
       # Combine results
       result = {
           "answer": rag_result["answer"],
           "context": rag_result["context"],
           "sources": rag_result["sources"] + ["Domain API"],
           "metrics": rag_result["metrics"]
       }
       
       return result
   ```

2. Add a formatting method:
   ```python
   def _format_new_domain_response(self, data: Dict[str, Any]) -> str:
       return f"New Domain Analysis: {data.get('summary', 'No data available')}"
   ```

3. Update the domain list in the query schema.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Pathway](https://github.com/pathwaycom/pathway) for real-time data processing
- [LangChain](https://github.com/langchain-ai/langchain) for LLM application framework
- [Pinecone](https://www.pinecone.io/) for vector database
- [FastAPI](https://fastapi.tiangolo.com/) for the web framework
- [Sentence Transformers](https://www.sbert.net/) for embeddings
