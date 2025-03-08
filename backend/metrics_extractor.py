from typing import Dict, List, Optional
import re
from dataclasses import dataclass

@dataclass
class FinancialMetrics:
    ebitda: Optional[float]
    revenue: Optional[float]
    net_income: Optional[float]
    roi: Optional[float]
    debt_ratio: Optional[float]

class MetricsExtractor:
    def __init__(self):
        self.metrics_patterns = {
            'ebitda': r'EBITDA.*?(-?\$?\d+\.?\d*\s*(million|billion|M|B)?)',
            'revenue': r'revenue.*?(-?\$?\d+\.?\d*\s*(million|billion|M|B)?)',
            'net_income': r'net income.*?(-?\$?\d+\.?\d*\s*(million|billion|M|B)?)',
            'roi': r'ROI.*?(-?\d+\.?\d*%?)',
            'debt_ratio': r'debt ratio.*?(-?\d+\.?\d*%?)',
        }

    def _normalize_value(self, value: str) -> float:
        value = value.strip().replace('$', '').replace('%', '')
        multiplier = 1
        
        if 'billion' in value.lower() or 'B' in value:
            multiplier = 1_000_000_000
            value = value.lower().replace('billion', '').replace('b', '')
        elif 'million' in value.lower() or 'M' in value:
            multiplier = 1_000_000
            value = value.lower().replace('million', '').replace('m', '')
            
        try:
            return float(value.strip()) * multiplier
        except ValueError:
            return 0.0

    def extract_metrics(self, text: str) -> FinancialMetrics:
        metrics = {}
        for metric, pattern in self.metrics_patterns.items():
            match = re.search(pattern, text.lower())
            if match:
                value = self._normalize_value(match.group(1))
                metrics[metric] = value
            else:
                metrics[metric] = None
                
        return FinancialMetrics(**metrics)