import requests
from typing import List, Dict, Any, Optional

class LLM:
    def __init__(self, model: str = "mistral"):
        self.model = model
        self.api_url = "http://localhost:11434/api/generate"
        
    async def generate_response(self, query: str, context: List[Dict[str, Any]], domain: str = "finance") -> str:
        # Format context for the prompt
        context_str = "\n".join([
            f"Source ({item['source']}): {item['text']}"
            for item in context
        ])
        
        # Domain-specific prompts
        domain_prompts = {
            "finance": "You are a financial analysis AI assistant specializing in real-time analyst reports, market intelligence, and due diligence.",
            "healthcare": "You are a medical research assistant AI specializing in analyzing clinical studies, medical journals, and providing evidence-based insights.",
            "legal": "You are a legal analysis AI assistant specializing in contract analysis, regulatory compliance, and risk assessment.",
            "news": "You are a fact-checking AI assistant that cross-references claims with reliable sources and provides journalistic analysis.",
            "ecommerce": "You are an AI-powered product advisor specialized in product comparisons and personalized recommendations.",
            "education": "You are an educational AI tutor specializing in explaining complex concepts using proven teaching methods.",
            "code": "You are a code assistant AI specializing in providing implementation examples, debugging help, and best practices.",
            "hr": "You are an HR automation AI specializing in candidate assessment, policy analysis, and recruitment optimization.",
            "travel": "You are a travel planning AI specializing in creating personalized itineraries and travel recommendations.",
            "science": "You are a scientific research AI specializing in analyzing research papers and summarizing scientific findings.",
            "cybersecurity": "You are a cybersecurity AI specializing in threat intelligence analysis and security recommendations.",
            "knowledge": "You are a knowledge management AI specializing in analyzing internal documents and extracting key insights.",
            "realestate": "You are a real estate analysis AI specializing in market trends, property insights, and investment opportunities.",
            "fitness": "You are a fitness and health coaching AI specializing in personalized exercise and nutrition recommendations.",
            "support": "You are a customer support AI specializing in providing accurate technical assistance and troubleshooting guidance."
        }

        prompt = f"""{domain_prompts.get(domain, domain_prompts["knowledge"])} Use the following context to answer the question. 
If you cannot answer the question based on the context, say so.

Context:
{context_str}

Question: {query}

Answer:"""

        response = requests.post(
            self.api_url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code != 200:
            raise Exception("Failed to get response from LLM")
            
        return response.json()["response"]
    
    async def summarize(self, text: str, instruction: str) -> str:
        """Summarize text with specific instructions."""
        prompt = f"""Please {instruction}. Focus only on the most important information.

Text to analyze:
{text}

Summary:"""

        response = requests.post(
            self.api_url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code != 200:
            raise Exception("Failed to get summary from LLM")
            
        return response.json()["response"]
    
    async def fact_check(self, claim: str, sources: List[str]) -> Dict[str, Any]:
        """Fact check a claim against provided sources."""
        sources_str = "\n".join([f"Source {i+1}: {source}" for i, source in enumerate(sources)])
        
        prompt = f"""You are a fact-checking AI. Analyze the following claim against the provided sources.
Rate the claim's accuracy on a scale of 1-5 where:
1 = False
2 = Mostly False
3 = Mixed
4 = Mostly True
5 = True

Also provide a brief explanation for your rating.

Claim: {claim}

Sources:
{sources_str}

Analysis:"""

        response = requests.post(
            self.api_url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code != 200:
            raise Exception("Failed to get fact check from LLM")
        
        analysis = response.json()["response"]
        
        # Extract rating from analysis
        rating = 3  # Default to "Mixed" if can't determine
        for i in range(1, 6):
            if f"{i}/5" in analysis or f"{i} out of 5" in analysis or f"Rating: {i}" in analysis:
                rating = i
                break
        
        return {
            "rating": rating,
            "explanation": analysis
        }
    
    async def generate_recommendations(self, query: str, sources: List[str]) -> List[Dict[str, Any]]:
        """Generate product recommendations based on query and sources."""
        sources_str = "\n".join([f"Source {i+1}: {source}" for i, source in enumerate(sources)])
        
        prompt = f"""You are a product recommendation AI. Based on the user query and the provided product information,
recommend 3-5 products that best match the user's needs. For each product, provide:
1. Product name
2. Key features (bullet points)
3. Why it's a good match for the user
4. Estimated price range

User Query: {query}

Product Information:
{sources_str}

Recommendations (in JSON format):
[
  {{
    "name": "Product Name",
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "reasoning": "Why this product is recommended",
    "price_range": "$XX - $YY"
  }},
  ...
]"""

        response = requests.post(
            self.api_url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code != 200:
            raise Exception("Failed to get recommendations from LLM")
        
        recommendations_text = response.json()["response"]
        
        # Extract JSON part
        try:
            import re
            import json
            json_match = re.search(r'\[\s*\{.*\}\s*\]', recommendations_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                recommendations = json.loads(json_str)
            else:
                # Fallback if JSON not properly formatted
                recommendations = [
                    {"name": "Recommended Product", "features": ["Based on your query"], 
                     "reasoning": "Please refine your query for better recommendations",
                     "price_range": "Unknown"}
                ]
        except Exception as e:
            recommendations = [
                {"name": "Parsing Error", "features": ["Unable to parse recommendations"],
                 "reasoning": f"Error: {str(e)}", "price_range": "Unknown"}
            ]
        
        return recommendations
    
    async def analyze_domain_specific(self, text: str, domain: str, instruction: str) -> Dict[str, Any]:
        """Analyze text with domain-specific instructions."""
        domain_instructions = {
            "legal": "Extract key clauses, identify potential risks, and assess compliance implications.",
            "finance": "Extract financial metrics, analyze market impact, and identify key trends.",
            "education": "Break down complex concepts, provide analogies, and structure learning points.",
            "healthcare": "Analyze clinical findings, identify treatment implications, and assess medical evidence.",
            "code": "Extract code patterns, identify potential issues, and suggest improvements.",
            "hr": "Analyze candidate qualifications, identify key skills, and assess role fit.",
            "cybersecurity": "Identify security threats, assess vulnerability impact, and recommend mitigations.",
            "realestate": "Analyze market indicators, identify property insights, and assess investment potential.",
            "fitness": "Extract workout components, analyze nutritional aspects, and provide evidence-based recommendations."
        }

        prompt = f"""Analyze the following text as a {domain} specialist. {domain_instructions.get(domain, instruction)}

Text to analyze:
{text}

Analysis:"""

        response = requests.post(
            self.api_url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code != 200:
            raise Exception("Failed to get analysis from LLM")
        
        analysis = response.json()["response"]
        return self._parse_domain_analysis(analysis, domain)
    
    def _parse_domain_analysis(self, analysis: str, domain: str) -> Dict[str, Any]:
        """Parse domain-specific analysis into structured data."""
        # Default structure for the analysis
        result = {
            "summary": analysis,
            "domain": domain,
            "key_points": [],
            "recommendations": [],
            "risks": [],
            "confidence_score": None
        }
        
        # Add domain-specific fields based on the type of analysis
        if domain == "legal":
            result["clauses"] = self._extract_sections(analysis, "clause")
            result["risks"] = self._extract_sections(analysis, "risk")
            result["compliance_status"] = self._extract_status(analysis)
            
        elif domain == "finance":
            result["metrics"] = self._extract_metrics(analysis)
            result["market_impact"] = self._extract_impact(analysis)
            result["trends"] = self._extract_trends(analysis)
            
        elif domain == "healthcare":
            result["clinical_findings"] = self._extract_findings(analysis)
            result["evidence_level"] = self._extract_evidence_level(analysis)
            result["treatment_implications"] = self._extract_implications(analysis)
            
        elif domain == "cybersecurity":
            result["threat_level"] = self._extract_threat_level(analysis)
            result["vulnerabilities"] = self._extract_vulnerabilities(analysis)
            result["mitigations"] = self._extract_mitigations(analysis)
            
        return result

    def _extract_sections(self, text: str, section_type: str) -> List[Dict[str, Any]]:
        """Extract sections (clauses, risks, etc.) from analysis text."""
        # Implementation would use regex or other text processing to extract structured data
        return []

    def _extract_status(self, text: str) -> str:
        """Extract status information from analysis text."""
        return ""

    def _extract_metrics(self, text: str) -> Dict[str, float]:
        """Extract numerical metrics from analysis text."""
        return {}

    def _extract_impact(self, text: str) -> Dict[str, Any]:
        """Extract impact assessment from analysis text."""
        return {}

    def _extract_trends(self, text: str) -> List[Dict[str, Any]]:
        """Extract trend information from analysis text."""
        return []

    def _extract_findings(self, text: str) -> List[Dict[str, Any]]:
        """Extract clinical findings from analysis text."""
        return []

    def _extract_evidence_level(self, text: str) -> str:
        """Extract evidence level from analysis text."""
        return ""

    def _extract_implications(self, text: str) -> List[Dict[str, Any]]:
        """Extract implications from analysis text."""
        return []

    def _extract_threat_level(self, text: str) -> str:
        """Extract threat level from analysis text."""
        return ""

    def _extract_vulnerabilities(self, text: str) -> List[Dict[str, Any]]:
        """Extract vulnerabilities from analysis text."""
        return []

    def _extract_mitigations(self, text: str) -> List[Dict[str, Any]]:
        """Extract mitigation strategies from analysis text."""
        return []