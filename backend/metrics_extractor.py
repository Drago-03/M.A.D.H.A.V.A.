import re
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
import json
from datetime import datetime

@dataclass
class Metrics:
    # Financial metrics (with ₹ support)
    revenue: Optional[float] = None
    profit: Optional[float] = None
    growth_rate: Optional[float] = None
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    eps: Optional[float] = None
    
    # Healthcare metrics
    efficacy_rate: Optional[float] = None
    trial_size: Optional[int] = None
    p_value: Optional[float] = None
    confidence_interval: Optional[str] = None
    
    # Legal metrics
    risk_score: Optional[float] = None
    compliance_rate: Optional[float] = None
    violation_count: Optional[int] = None
    
    # News metrics
    credibility_score: Optional[float] = None
    source_reliability: Optional[float] = None
    fact_check_confidence: Optional[float] = None
    
    # E-commerce metrics
    price: Optional[float] = None
    stock_level: Optional[int] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None

class MetricsExtractor:
    def __init__(self):
        self.patterns = {
            # Financial patterns with ₹ symbol
            'revenue': r'₹?\s*(\d+(?:\.\d+)?)\s*(?:crore|lakh|k)?\s*(?:INR)?\s*(?:revenue|sales)',
            'profit': r'₹?\s*(\d+(?:\.\d+)?)\s*(?:crore|lakh|k)?\s*(?:INR)?\s*(?:profit|earnings|net income)',
            'growth_rate': r'(\d+(?:\.\d+)?)\s*%\s*(?:growth|increase)',
            'market_cap': r'₹?\s*(\d+(?:\.\d+)?)\s*(?:crore|lakh|k)?\s*(?:INR)?\s*(?:market cap|valuation)',
            'pe_ratio': r'(?:P/E|PE)\s*(?:ratio)?\s*(?:of)?\s*(\d+(?:\.\d+)?)',
            'eps': r'EPS\s*(?:of)?\s*₹?\s*(\d+(?:\.\d+)?)',
            
            # Healthcare patterns...
            'efficacy_rate': r'(\d+(?:\.\d+)?)\s*%\s*(?:efficacy|effectiveness|success rate)',
            'trial_size': r'(?:n\s*=\s*|sample size\s*(?:of)?\s*)(\d+)',
            'p_value': r'[pP](?:\s*-\s*|\s+)value\s*(?:of)?\s*(\d+\.\d+)',
            'confidence_interval': r'(?:CI|confidence interval)\s*(?:of)?\s*(\d+(?:\.\d+)?%?\s*[-–]\s*\d+(?:\.\d+)?%?)',
            
            # Legal patterns...
            'risk_score': r'(?:risk score|risk level)\s*(?:of)?\s*(\d+(?:\.\d+)?)',
            'compliance_rate': r'(\d+(?:\.\d+)?)\s*%\s*(?:compliance|compliant)',
            'violation_count': r'(\d+)\s*(?:violations|infractions|breaches)',
            
            # News patterns...
            'credibility_score': r'(\d+(?:\.\d+)?)\s*%\s*(?:credibility|credible)',
            'source_reliability': r'(\d+(?:\.\d+)?)\s*%\s*(?:reliable|reliability)',
            'fact_check_confidence': r'(\d+(?:\.\d+)?)\s*%\s*(?:fact check|verified)',
            
            # E-commerce patterns...
            'price': r'₹?\s*(\d+(?:\.\d+)?)\s*(?:k)?\s*(?:INR)?',
            'stock_level': r'(\d+)\s*(?:items? in stock|available)',
            'rating': r'(\d+(?:\.\d+)?)\s*(?:\/\s*5)?\s*(?:stars?|rating)',
            'review_count': r'(\d+)\s*(?:reviews?|ratings?)'
        }
        
        self.multipliers = {
            'crore': 10_000_000,
            'lakh': 100_000,
            'k': 1_000
        }

    def extract_metrics(self, text: str) -> Metrics:
        metrics = Metrics()
        
        for field, pattern in self.patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                value = match.group(1)
                # Handle numeric conversions
                try:
                    if '.' in value:
                        value = float(value)
                    else:
                        value = int(value)
                        
                    # Apply multipliers if present
                    for suffix, multiplier in self.multipliers.items():
                        if suffix in match.group(0).lower():
                            value *= multiplier
                            break
                            
                    setattr(metrics, field, value)
                except ValueError:
                    # For non-numeric values (like confidence intervals)
                    setattr(metrics, field, value)
        
        return metrics

    def extract_domain_metrics(self, text: str, domain: str) -> Dict[str, Any]:
        """Extract metrics specific to a domain."""
        metrics = self.extract_metrics(text)
        result = {}
        
        # Map metrics to domain-specific fields
        if domain == "finance":
            for field in ['revenue', 'profit', 'growth_rate', 'market_cap', 'pe_ratio', 'eps']:
                value = getattr(metrics, field)
                if value is not None:
                    result[field] = value
                    
        elif domain == "healthcare":
            for field in ['efficacy_rate', 'trial_size', 'p_value', 'confidence_interval']:
                value = getattr(metrics, field)
                if value is not None:
                    result[field] = value
                    
        elif domain == "legal":
            for field in ['risk_score', 'compliance_rate', 'violation_count']:
                value = getattr(metrics, field)
                if value is not None:
                    result[field] = value
                    
        elif domain == "science":
            for field in ['sample_size', 'margin_error', 'correlation']:
                value = getattr(metrics, field)
                if value is not None:
                    result[field] = value
                    
        elif domain == "hr":
            for field in ['candidate_match_score', 'experience_years', 'skill_match_rate']:
                value = getattr(metrics, field)
                if value is not None:
                    result[field] = value
        
        # Add performance metrics for any domain
        for field in ['response_time', 'accuracy_rate', 'success_rate']:
            value = getattr(metrics, field)
            if value is not None:
                result[field] = value
        
        return result

    def format_metrics(self, metrics: Dict[str, Any]) -> str:
        """Format metrics into a human-readable string with ₹ symbol."""
        parts = []
        for key, value in metrics.items():
            if isinstance(value, (int, float)):
                if key.endswith('_rate') or key in ['accuracy', 'confidence']:
                    parts.append(f"{key.replace('_', ' ').title()}: {value}%")
                elif any(k in key for k in ['revenue', 'profit', 'price', 'market_cap']):
                    if value >= 10_000_000:
                        parts.append(f"{key.replace('_', ' ').title()}: ₹{value/10_000_000:.2f} Cr")
                    elif value >= 100_000:
                        parts.append(f"{key.replace('_', ' ').title()}: ₹{value/100_000:.2f} L")
                    elif value >= 1_000:
                        parts.append(f"{key.replace('_', ' ').title()}: ₹{value/1_000:.1f}K")
                    else:
                        parts.append(f"{key.replace('_', ' ').title()}: ₹{value}")
                else:
                    parts.append(f"{key.replace('_', ' ').title()}: {value}")
            else:
                parts.append(f"{key.replace('_', ' ').title()}: {value}")
        
        return "\n".join(parts)

    def extract_finance_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract metrics from Bloomberg API response"""
        return {
            'market_cap': data.get('market_cap'),
            'volume': data.get('volume'),
            'volatility': data.get('volatility'),
            'price_change': data.get('price_change'),
            'timestamp': datetime.utcnow().isoformat()
        }

    def extract_legal_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract metrics from CourtListener API response"""
        return {
            'case_count': len(data.get('cases', [])),
            'precedents': len(data.get('cited_by', [])),
            'jurisdiction': data.get('jurisdiction'),
            'timestamp': datetime.utcnow().isoformat()
        }

    def extract_education_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract metrics from NLP education response"""
        return {
            'comprehension_score': data.get('comprehension_score'),
            'engagement_level': data.get('engagement_level'),
            'progress': data.get('progress'),
            'timestamp': datetime.utcnow().isoformat()
        }

    def extract_code_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract metrics from Gemini code analysis"""
        return {
            'code_quality': data.get('code_quality'),
            'performance_score': data.get('performance_score'),
            'security_score': data.get('security_score'),
            'timestamp': datetime.utcnow().isoformat()
        }

    def extract_medical_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract metrics from DeepChem analysis"""
        return {
            'confidence': data.get('confidence'),
            'accuracy': data.get('accuracy'),
            'validation_score': data.get('validation_score'),
            'timestamp': datetime.utcnow().isoformat()
        }

    def extract_support_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract metrics from customer support analysis"""
        return {
            'response_time': data.get('response_time'),
            'satisfaction_score': data.get('satisfaction_score'),
            'resolution_rate': data.get('resolution_rate'),
            'timestamp': datetime.utcnow().isoformat()
        }

    def extract_travel_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract metrics from Gemini travel analysis"""
        return {
            'recommendations': len(data.get('recommendations', [])),
            'price_range': data.get('price_range'),
            'optimal_timing': data.get('optimal_timing'),
            'timestamp': datetime.utcnow().isoformat()
        }

    def extract_real_estate_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract metrics from Gemini real estate analysis"""
        return {
            'market_value': data.get('market_value'),
            'price_trend': data.get('price_trend'),
            'investment_score': data.get('investment_score'),
            'timestamp': datetime.utcnow().isoformat()
        }

    def extract_metrics(self, domain: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Extract domain-specific metrics from API response"""
        extractors = {
            'finance': self.extract_finance_metrics,
            'legal': self.extract_legal_metrics,
            'education': self.extract_education_metrics,
            'code': self.extract_code_metrics,
            'medical': self.extract_medical_metrics,
            'customerSupport': self.extract_support_metrics,
            'travel': self.extract_travel_metrics,
            'realEstate': self.extract_real_estate_metrics
        }

        extractor = extractors.get(domain)
        if not extractor:
            return None

        try:
            metrics = extractor(data)
            return metrics
        except Exception as e:
            print(f"Error extracting metrics for {domain}: {str(e)}")
            return None