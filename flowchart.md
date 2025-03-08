# M.A.D.H.A.V.A. Application Workflow

## System Architecture Overview

```mermaid
graph TB
    subgraph Frontend
        UI[User Interface]
        QI[Query Interface]
        DS[Domain Selection]
    end

    subgraph Backend Services
        API[FastAPI Gateway]
        ES[Embedding Store]
        GS[Gemini Service]
        ME[Metrics Extractor]
        AM[Alert Manager]
    end

    subgraph Databases
        MongoDB[(MongoDB)]
        Redis[(Redis Cache)]
        VS[Vector Store]
    end

    UI --> QI
    QI --> API
    DS --> QI
    API --> ES
    API --> GS
    API --> ME
    API --> AM
    ES --> VS
    ME --> MongoDB
    AM --> Redis
```

## Detailed Workflow

### 1. User Interaction Flow
```mermaid
sequenceDiagram
    participant User
    participant UI as Frontend UI
    participant API as Backend API
    participant GS as Gemini Service
    participant ES as Embedding Store

    User->>UI: Select Domain
    User->>UI: Enter Query
    UI->>API: POST /query
    API->>ES: Get Relevant Context
    ES->>API: Return Context
    API->>GS: Generate Response
    GS->>API: Return AI Response
    API->>UI: Complete Response
    UI->>User: Display Results
```

### 2. Domain-Specific Processing
```mermaid
graph LR
    subgraph Domains
        F[Finance]
        H[Healthcare]
        L[Legal]
        C[Code Assistant]
        N[News]
        E[E-commerce]
    end

    subgraph Processing
        VC[Vector Context]
        MA[Metrics Analysis]
        DR[Domain Rules]
        IG[Insight Generation]
    end

    F --> VC & MA & DR & IG
    H --> VC & MA & DR & IG
    L --> VC & MA & DR & IG
    C --> VC & MA & DR & IG
    N --> VC & MA & DR & IG
    E --> VC & MA & DR & IG
```

## Component Details

### 1. Frontend Components
- **User Interface**
  - Domain selection cards
  - Query interface
  - Response display
  - Insights section
  - Metrics visualization

### 2. Backend Services
- **FastAPI Gateway**
  - Route handling
  - Request validation
  - Response formatting
  - Error handling
  - CORS management

- **Embedding Store**
  - Vector similarity search
  - Context retrieval
  - Domain-specific embeddings
  - Metadata filtering

- **Gemini Service**
  - Query processing
  - Context integration
  - Response generation
  - Domain-specific insights

- **Metrics Extractor**
  - Data analysis
  - Pattern recognition
  - Statistical processing
  - Trend identification

- **Alert Manager**
  - Real-time notifications
  - WebSocket connections
  - Alert history
  - Severity management

### 3. Data Flow
```mermaid
flowchart TD
    A[User Query] --> B{Domain Router}
    B --> C[Context Retrieval]
    B --> D[Metrics Analysis]
    C --> E[Vector Search]
    D --> F[Pattern Recognition]
    E --> G[Context Integration]
    F --> G
    G --> H[Gemini Processing]
    H --> I[Response Generation]
    I --> J[Insight Extraction]
    J --> K[Final Response]
```

### 4. Database Architecture
```mermaid
graph TB
    subgraph Vector Store
        E1[Domain Embeddings]
        E2[Document Vectors]
        E3[Metadata Index]
    end

    subgraph MongoDB
        M1[User Data]
        M2[Query History]
        M3[Analytics]
    end

    subgraph Redis
        R1[Cache]
        R2[Real-time Events]
        R3[Session Data]
    end

    E1 --> E2 --> E3
    M1 --> M2 --> M3
    R1 --> R2 --> R3
```

## Key Features

### 1. Domain-Specific Processing
- Finance: Market analysis, investment insights
- Healthcare: Medical research, clinical analysis
- Legal: Case analysis, compliance
- Code Assistant: AI debugging, code review
- News: Trend analysis, real-time updates
- E-commerce: Market trends, consumer behavior

### 2. RAG Implementation
```mermaid
graph LR
    Q[Query] --> E[Embedding]
    E --> S[Similarity Search]
    S --> C[Context Retrieval]
    C --> G[Gemini Processing]
    G --> R[Response]
    R --> I[Insights]
```

### 3. Performance Optimization
```mermaid
graph TD
    subgraph Caching Strategy
        RC[Redis Cache]
        VB[Vector Batching]
        PP[Parallel Processing]
    end

    subgraph Query Optimization
        QR[Query Reformulation]
        CF[Context Filtering]
        RM[Relevance Matching]
    end

    RC --> VB --> PP
    QR --> CF --> RM
```

## Error Handling and Monitoring
```mermaid
graph TB
    E[Error Detection] --> C{Classification}
    C --> V[Validation Errors]
    C --> P[Processing Errors]
    C --> S[System Errors]
    V --> H[Handler]
    P --> H
    S --> H
    H --> R[Response]
    H --> L[Logging]
    H --> M[Monitoring]
```

This flowchart provides a comprehensive overview of the M.A.D.H.A.V.A. application's architecture, components, and data flow. Each section details the specific responsibilities and interactions within the system, making it easier to understand the complete workflow of the RAG implementation. 