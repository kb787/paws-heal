import os
import openai
from enum import Enum
from Siva.rag.rag.settings import logger
from Siva.rag.rag.secrets import Secrets
from llama_index.core import Settings
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
import random
import numpy as np


class LiteLLMModels(Enum):
    GEMMA_2_27B_IT = "google/gemma-2-27b-it"
    META_LLAMA_3_8B = "solidrust/Meta-Llama-3-8B-Instruct-hf-AWQ"
    PHI_3_MINI = "microsoft/Phi-3-mini-4k-instruct"


class Models:
    """
    A class to initialize and manage the LLM and embedding models.

    Attributes
    ----------
    llm : AzureChatOpenAI
        An instance of the AzureChatOpenAI model.
    embed_model : AzureOpenAIEmbeddings
        An instance of the AzureOpenAIEmbeddings model.
    litellm : OpenAI
        An instance of models hosted using LiteLLM.
    """

    def __init__(self, seed=None):
        """
        Initializes the Azure large language models and embedding models.
        """
        
        if seed is not None:
            self.set_seed(seed)

        self.azure_llm = AzureChatOpenAI(
            base_url=Secrets.GPT4o_BASE_URL,
            openai_api_version=Secrets.GPT4o_VERSION,
            openai_api_key=Secrets.GPT4o_KEY,
            openai_api_type="azure",
            model=Secrets.GPT4o_MODEL,
            temperature=0,
        )
        logger.info(f"Azure {Secrets.GPT4o_MODEL} initialized")

        self.embed_model = AzureOpenAIEmbeddings(
            openai_api_version=Secrets.TE3S_VERSION,
            base_url=Secrets.TE3S_BASE_URL,
            openai_api_key=Secrets.TE3S_API_KEY,
        )
        logger.info(f"Azure {Secrets.TE3S_MODEL} initialized")

        # self.lite_llm = openai.OpenAI(
        #     api_key=Secrets.LITELLM_KEY, base_url=Secrets.LITELLM_BASE_URL
        # )
        # logger.info("LiteLLM initialized")
    
    def set_seed(self, seed):
        random.seed(seed)
        np.random.seed(seed)