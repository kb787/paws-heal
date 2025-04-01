import os
import warnings
from typing import Union
from Siva.rag.rag.models import Models
from Siva.rag.rag.settings import logger
from operator import itemgetter
from Siva.rag.rag.history import InMemoryHistory
from Siva.rag.rag.prompts import Prompts
from Siva.rag.rag.models import LiteLLMModels
from llama_index.core import Settings
from langchain.globals import set_llm_cache

from langchain_community.cache import InMemoryCache

import redis
from langchain_core.runnables import (
    ConfigurableFieldSpec,
    RunnablePassthrough,
)
from Siva.rag.rag.secrets import Secrets
from Siva.rag.rag.utils import TimeConverter
from Siva.rag.rag.processing.vectorstores import VectorStoreManager

# from Siva.rag.rag.processing.custom_chat_store import MongoChatStore
from langchain_community.callbacks import get_openai_callback
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.agents import initialize_agent, AgentType, Tool
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain

from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.llms import OpenAI


from Siva.rag.rag.analytics import Analytics
from Siva.rag.rag.prompts import Prompts
from pprint import pprint
from typing import Union
import random
import numpy as np


class ChatService:
    def __init__(self):
        SEED_VALUE = 42
        self.URI = Secrets.ATLAS_CONNECTION_STRING
        self.prompts = Prompts()
        self.models = Models(seed=SEED_VALUE)
        Settings.llm = self.models.azure_llm
        Settings.embed_model = self.models.embed_model

        set_llm_cache(InMemoryCache())

        os.environ["ALLOW_RESET"] = "TRUE"
        self.store = {}
        self.analytics = Analytics()
        self.time_converter = TimeConverter()

    # def _initialize_chat_store(self):
    #     """
    #     Initializes the chat store.

    #     Returns
    #     -------
    #     SimpleChatStore
    #         The initialized chat store.

    #     Raises
    #     ------
    #     Exception
    #         If there is an error initializing the chat store.
    #     """
    #     try:
    #         chat_store = MongoChatStore(self.URI, "test_chat_store")
    #         logger.info("Chat store initialized successfully")
    #         return chat_store
    #     except Exception as e:
    #         logger.error(f"Error initializing chat store: {e}")
    #         raise

    def ask_litellm(
        self,
        query: str,
        model: Union[LiteLLMModels, str] = LiteLLMModels.GEMMA_2_27B_IT,
    ) -> dict:
        """
        Queries the LiteLLM model with a given query and model.

        Parameters
        ----------
        query : str
            The query to send to the LiteLLM model.
        model : LiteLLMModel or str
            The model to use for the query. Default is LiteLLMModel.GEMMA_2_27B_IT.

        Returns
        -------
        dict
            A dictionary containing the response, usage, and model information.
        """
        if isinstance(model, LiteLLMModels):
            model = model.value

        messages = [{"role": "user", "content": query}]
        response = self.models.lite_llm.chat.completions.create(
            model=model, messages=messages
        )
        return {
            "response": response.choices[0].message.content,
            "usage": response.usage,
            "model": response.model,
        }

    def get_sources(self, docs):
        sources = set()
        pages = set()

        for doc in docs:

            if "file_name" in doc.metadata:
                sources.add(doc.metadata["file_name"])
            elif "source" in doc.metadata:
                sources.add(doc.metadata["source"])
            else:
                sources.add("Unknown Source")

            # Page handling
            if "page" in doc.metadata:
                pages.add(doc.metadata["page"])
            elif doc.metadata.get("source") == "Markdown":
                pages.add("Web Content")
            else:
                pages.add("N/A")

        return list(sources), list(pages)

    def format_docs(self, docs):
        context = "\n\n".join(doc.page_content for doc in docs)
        return context

    def classify_query(self, query: str) -> str:
        # List of known greetings or non-informative phrases
        greetings = [
            "hi",
            "hello",
            "hey",
            "good morning",
            "good evening",
            "thank you",
            "thanks",
            "bye",
            "goodbye",
            "how are you",
            "what's up",
            "what's going on",
            "how's it going",
            "how are things",
            "what's new",
        ]

        query = query.lower().strip()

        if any(greeting in query for greeting in greetings):
            return "greeting"

        # Default classification
        return "informative"

    def get_session_history(
        self, user_id: str, conversation_id: str
    ) -> BaseChatMessageHistory:
        if (user_id, conversation_id) not in self.store:
            self.store[(user_id, conversation_id)] = InMemoryHistory()
        return self.store[(user_id, conversation_id)]

    def query_transcripts(self, user_query: str):
        try:
            vector_store_manager = VectorStoreManager(URI=self.URI)
            vectorstore = vector_store_manager._get_vector_store("SIH", "transcripts")

            llm = self.models.azure_llm
            prompt = self.prompts.get_timestamp_prompt()
            document_chain = create_stuff_documents_chain(
                llm, self.prompts.get_timestamp_prompt()
            )
            retriever = vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3},
            )
            retrieval_chain = create_retrieval_chain(retriever, document_chain)
            response = retrieval_chain.invoke({"input": user_query})
            # pprint(response)
            # pprint(response["answer"])
            extracted_content = response["answer"]
            if extracted_content.strip() == "-1":
                logger.info("No timestamp found in the response.")
                return {"yt_link": "None", "valid_timestamp": False}

            if ":" in extracted_content:
                extracted_content = extracted_content.strip()
            else:
                total_seconds = int(extracted_content)
                minutes = total_seconds // 60
                seconds = total_seconds % 60
                extracted_content = f"{minutes:02}:{seconds:02}"

            sec = self.time_converter.convert_ts(extracted_content)

            if sec is not None:
                for doc in response["context"]:
                    page_content = doc.page_content
                    if extracted_content in page_content:
                        yt_link = doc.metadata["yt_link"]

                yt_link_with_timestamp = f"{yt_link}&t={sec}"
                logger.info(f"YouTube Link with Timestamp: {yt_link_with_timestamp}")
                return {"yt_link": yt_link_with_timestamp, "valid_timestamp": True}

            logger.info("The timestamp conversion returned None.")
            return {"yt_link": "None", "valid_timestamp": False}

        except Exception as e:
            logger.error(f"Error extracting timestamp: {e}")
            raise

    def chat(
        self,
        user_query: str,
        db_name: str,
        collection_name: str,
        user_ip: str,
    ):
        """
        Processes a user query and returns a response.

        Parameters
        ----------
        user_query : str
            The query from the user.
        user_ip : str
            The IP address of the user.
        db_name : str
            The name of the database.
        collection_name : str
            The name of the collection.

        Returns
        -------
        dict
            A dictionary containing the response and source documents.

        Raises
        ------
        Exception
            If there is an error processing the query.
        """
        try:
            warnings.filterwarnings("ignore")
            vector_store_manager = VectorStoreManager(
                URI=Secrets.ATLAS_CONNECTION_STRING
            )

            vectorstore = vector_store_manager._get_vector_store(
                db_name, collection_name
            )
            retriever = vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3},
            )
            context = itemgetter("question") | retriever | self.format_docs
            sources, pages = self.get_sources(
                retriever.get_relevant_documents(user_query)
            )
            query_type = self.classify_query(user_query)

            first_step = RunnablePassthrough.assign(context=context)
            chain = first_step | self.prompts.prompt | self.models.azure_llm

            with_message_history = RunnableWithMessageHistory(
                chain,
                get_session_history=self.get_session_history,
                input_messages_key="question",
                history_messages_key="history",
                history_factory_config=[
                    ConfigurableFieldSpec(
                        id="user_id",
                        annotation=str,
                        name="User ID",
                        description="Unique identifier for the user.",
                        default="",
                        is_shared=True,
                    ),
                    ConfigurableFieldSpec(
                        id="conversation_id",
                        annotation=str,
                        name="Conversation ID",
                        description="Unique identifier for the conversation.",
                        default="",
                        is_shared=True,
                    ),
                ],
            )

            with get_openai_callback() as cb:
                answer = with_message_history.invoke(
                    {"question": user_query},
                    config={
                        "configurable": {
                            "user_id": "user_id",
                            "conversation_id": "conversation_id",
                        }
                    },
                )
                logger.info(f"Total tokens used: {cb.total_tokens}")

            # transcript_response = {"yt_link": "None", "valid_timestamp": False}
            # if query_type == "informative":
                # transcript_response = self.query_transcripts(user_query)
                # yt_link = transcript_response["yt_link"]
                # if transcript_response["valid_timestamp"]:
                #     response = (
                #         f"{answer.content}\n\nYouTube video for reference: {yt_link}"
                #     )
                # else:
                #     response = answer.content

            response = answer.content

            self.analytics.store_query_data(
                user_query,
                response,
                user_ip,
                sources,
                cb.prompt_tokens,
                cb.completion_tokens,
            )
            logger.info("Query processed successfully")
            return {
                "response": response,
                "response_metadata": answer.response_metadata,
                "sources": sources,
                "pages": pages,
            }
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            raise
