import os
import pymongo
import openai
from langchain_core.pydantic_v1 import BaseModel, Field
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
    Settings,
)


# from llama_index.retrievers.bm25 import BM25Retriever
# from llama_index.readers.s3 import S3Reader

# from llama_index.core import ChatPromptTemplate
# from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from langchain.vectorstores import MongoDBAtlasVectorSearch
from llama_index.core.storage.chat_store import SimpleChatStore
from llama_index.core.memory import ChatMemoryBuffer
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain_community.callbacks import get_openai_callback
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from langchain_community.document_loaders import TextLoader
from langchain_core.messages.ai import AIMessage


from langchain_core.documents import Document


import logging
import warnings
import datetime
from dotenv import load_dotenv
import random
import numpy as np
from pprint import pprint
from llama_index.core import get_response_synthesizer
from Siva.rag.rag.processing.database import DatabaseConnector
from Siva.rag.rag.secrets import Secrets
from Siva.rag.rag.settings import logger


class Analytics:
    def __init__(self):
        db = DatabaseConnector("mongodb", Secrets.ATLAS_CONNECTION_STRING)
        self.client = db.client
        self.db_name = "SIH"
        self.collection_name = "analytics"
        self.total_tokens = 0

    def store_query_data(
        self,
        user_query: str,
        answer: str,
        user_ip: str,
        source_doc: str,
        prompt_tokens: int,
        completion_tokens: int,
    ):
        try:
            if isinstance(answer, AIMessage):
                answer = answer.content  # or use a method to convert to dict if needed

            db = self.client[self.db_name]
            collection = db[self.collection_name]
            data = {
                "user_query": user_query,
                "answer": answer,
                "user_ip": user_ip,
                "source_doc": source_doc,
                "timestamp": datetime.datetime.utcnow(),
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
            }

            collection.insert_one(data)
            logger.info("Query data stored successfully")
        except Exception as e:
            logger.error(f"Error storing query data: {e}")
            raise

    def update_token_count(self, current_tokens: int):
        self.total_tokens += current_tokens
        logger.info(f"Total token count: {self.total_tokens}")
