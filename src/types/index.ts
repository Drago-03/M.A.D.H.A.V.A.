export type Domain = 
  | 'finance' 
  | 'legal' 
  | 'education'
  | 'code'
  | 'medical'
  | 'customerSupport'
  | 'travel'
  | 'realEstate';

export interface FinancialData {
  id: string;
  timestamp: string;
  metrics?: {
    revenue?: number;
    profit?: number;
    growth_rate?: number;
    market_cap?: number;
    pe_ratio?: number;
    eps?: number;
  };
}

export interface QueryResponse {
  answer: string;
  context: string[];
  sources: string[];
  metrics?: Record<string, any>;
  domain_specific_data?: Record<string, any>;
  timestamp: string;
}

export interface QueryRequest {
  query: string;
  domain: Domain;
  user_id?: string | null;
  filters?: Record<string, any>;
}

export interface DomainConfig {
  title: string;
  description: string;
  color: string;
  textColor: string;
  icon: any;
  symbol: string;
  apiSource: string;
  isPremium: boolean;
  features: string[];
}

export interface DomainConfigs {
  [key: string]: DomainConfig;
}