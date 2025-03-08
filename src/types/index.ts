export interface FinancialData {
  id: string;
  timestamp: string;
  type: 'news' | 'report' | 'regulation';
  content: string;
  source: string;
  relevance_score?: number;
}

export interface QueryResponse {
  answer: string;
  context: string[];
  sources: string[];
  timestamp: string;
  metrics?: Record<string, any>;
}

export interface QueryRequest {
  query: string;
  filters?: {
    type?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  };
}