import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_response(self, query: str, context: list, domain: str) -> str:
        # Construct the prompt with context
        prompt = f"""As an AI assistant specializing in {domain}, analyze the following query and context:

Query: {query}

Context:
{chr(10).join(f"- {ctx}" for ctx in context)}

Provide a detailed, professional response that:
1. Directly addresses the query
2. Uses relevant information from the context
3. Maintains domain-specific expertise in {domain}
4. Includes specific facts and metrics when available
5. Suggests actionable insights when applicable

Response:"""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating Gemini response: {e}")
            return f"I apologize, but I encountered an error while processing your query. Please try again. Error: {str(e)}"

    def get_domain_insights(self, domain: str, metrics: dict) -> str:
        prompt = f"""As an AI assistant specializing in {domain}, analyze these metrics and provide key insights:

Metrics:
{chr(10).join(f"- {k}: {v}" for k, v in metrics.items())}

Provide 3-5 key insights that:
1. Highlight important trends or patterns
2. Identify potential opportunities or risks
3. Suggest actionable recommendations

Insights:"""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating insights: {e}")
            return "Unable to generate insights at this time." 