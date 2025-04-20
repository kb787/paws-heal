import logging
import os
from livekit.agents import llm
from livekit.plugins import openai

logger = logging.getLogger("openai-service")
logger.setLevel(logging.INFO)


class Openai:
    def __init__(self):
        # Get environment variables
        base_url = os.getenv("LITELLM_BASE_URL")
        api_key = os.getenv("LITELLM_API_KEY")
        
        if not base_url or not api_key:
            logger.error("Missing LITELLM environment variables")
            raise ValueError("LITELLM_BASE_URL and LITELLM_API_KEY must be set")

        logger.info("Initializing OpenAI LLM with LiteLLM")
        self.llm = openai.LLM(
            base_url=base_url,
            api_key=api_key,
            model="azure-gpt-4o-mini",
            temperature=0.0,
        )

       
