import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class SummarizationService:
    def __init__(self):
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-70b-versatile"  # Free tier model
    
    def summarize(self, transcript):
        """
        Generate meeting summary with action items and key decisions
        
        Args:
            transcript (str): Meeting transcript
            
        Returns:
            dict: Summary, action items, and key decisions
        """
        try:
            prompt = f"""You are an expert meeting analyst. Analyze the following meeting transcript and provide:

1. A concise executive summary (2-3 sentences)
2. A list of key decisions made
3. A structured list of action items with owner, deadline, and priority

Format your response as JSON with this structure:
{{
    "summary": "Executive summary here",
    "key_decisions": ["decision 1", "decision 2", ...],
    "action_items": [
        {{
            "task": "Task description",
            "owner": "Person responsible",
            "deadline": "Deadline if mentioned, otherwise 'Not specified'",
            "priority": "High/Medium/Low"
        }}
    ]
}}

Meeting Transcript:
{transcript}

Provide ONLY the JSON response, no additional text."""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a professional meeting analyzer that outputs only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # Parse JSON response
            try:
                result = json.loads(result_text)
                return result
            except json.JSONDecodeError:
                # If JSON parsing fails, extract from markdown code blocks
                if "```json" in result_text:
                    result_text = result_text.split("```json")[1].split("```")[0].strip()
                    result = json.loads(result_text)
                    return result
                else:
                    raise Exception("Failed to parse LLM response as JSON")
        
        except Exception as e:
            raise Exception(f"Summarization failed: {str(e)}")
