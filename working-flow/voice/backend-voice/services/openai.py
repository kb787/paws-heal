import logging
import os

from livekit.plugins import openai

logger = logging.getLogger("openai-service")
logger.setLevel(logging.INFO)


class Openai:
    def __init__(self):
        self.llm = openai.LLM(
            base_url=os.getenv("LITELLM_BASE_URL"),
            api_key=os.getenv("LITELLM_API_KEY"),
            model="azure-gpt-4o-mini",
            temperature=0.0,
        )

       
