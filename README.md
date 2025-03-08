# Financial Insights RAG Application

This application provides real-time financial insights using Retrieval Augmented Generation (RAG) with Pathway, FAISS, and Ollama.

## Prerequisites

1. Install Ollama and download the Mistral model:
```bash
# macOS/Linux
curl https://ollama.ai/install.sh | sh
# Then run:
ollama pull mistral
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
cd backend
python main.py
```

4. Start the frontend development server:
```bash
npm run dev
```

## Features

- Real-time financial data processing with Pathway
- Vector similarity search using FAISS
- Local LLM integration with Ollama (Mistral)
- User authentication with Supabase
- Query history tracking
- Beautiful, responsive UI

## Architecture

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Pathway
- Vector Store: FAISS
- LLM: Ollama (Mistral)
- Authentication: Supabase
- Real-time Processing: Pathway

## Development

1. The backend server runs on `http://localhost:8000`
2. The frontend development server runs on `http://localhost:5173`
3. Ollama serves the LLM on `http://localhost:11434`