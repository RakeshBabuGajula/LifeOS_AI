import google.generativeai as genai
from app.core.config import settings
import logging

# Setup specific logger
logger = logging.getLogger("gemini")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

class GeminiClient:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set.")
        else:
            genai.configure(api_key=self.api_key)
            masked_key = f"{self.api_key[:5]}...{self.api_key[-5:]}"
            logger.info(f"Initialized GeminiClient. Key detected: {masked_key}")
            
        self.model_name = settings.GEMINI_MODEL or "gemini-1.5-flash"

    async def generate_content(self, prompt: str, system_instruction: str = None) -> str:
        """
        Generates content using the Gemini model.
        Args:
            prompt (str): The main prompt/content to generate from.
            system_instruction (str, optional): System instructions for the model.
        Returns:
            str: The generated text content.
        """
        try:
            generation_config = genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=8192,
                temperature=0.7,
                response_mime_type="application/json",
            )
            
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction,
                generation_config=generation_config
            )
            
            logger.info(f"Generating content with model: {self.model_name}")
            
            # Using async generation
            response = await model.generate_content_async(prompt)
            
            return response.text
            
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise e

gemini_client = GeminiClient()
