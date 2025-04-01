import os
import logging
from pymongo import MongoClient
from langchain_core.documents import Document
from langchain_core.document_loaders.base import BaseLoader
from langchain_openai import AzureOpenAIEmbeddings
from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ATLAS_CONNECTION_STRING = os.environ.get("ATLAS_CONNECTION_STRING")
ADA_BASE_URL = os.environ.get("AOAI_TE3S_BASE_URL")
ADA_API_KEY = os.environ.get("AOAI_TE3S_KEY")
ADA_VERSION = os.environ.get("AOAI_TE3S_VERSION")
ADA_MODEL = os.environ.get("AOAI_TE3S_MODEL")
ADA_DEPLOYMENT = os.environ.get("AOAI_TE3S_DEPLOYMENT")


class TextLoader(BaseLoader):
    def __init__(self, file_path: str):
        self.file_path = file_path

    def lazy_load(self):
        for file_name in os.listdir(self.file_path):
            if file_name.endswith(".txt"):
                full_path = os.path.join(self.file_path, file_name)
                with open(full_path, encoding="utf-8") as file:
                    text = file.read()
                    yield Document(page_content=text, metadata={"file_path": full_path})

    def load(self):
        return list(self.lazy_load())


class VectorStoreManager:
    def __init__(self, mongo_uri: str, db_name: str, embed_model):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.embed_model = embed_model

    def create_vector_store_from_documents(
        self, collection_name: str, index_name: str, documents: list
    ):
        if not documents:
            raise ValueError("The documents list cannot be empty.")

        try:
            collection = self.db[collection_name]
            vector_search = MongoDBAtlasVectorSearch(
                embedding=self.embed_model,
                collection=collection,
                index_name=index_name,
                relevance_score_fn="cosine",
            )

            vector_search.add_documents(documents)
            logger.info("Vector store created successfully")

            # Log the documents being added
            logger.info(f"Documents added to collection '{collection_name}':")
            for doc in documents:
                logger.info(doc.metadata)

            return vector_search
        except Exception as e:
            logger.error(f"Error creating vector store: {e}")
            raise

    @staticmethod
    def transcripts_from_directory(transcript_directory: str):
        try:
            reader = TextLoader(file_path=transcript_directory)
            documents = reader.load()
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
            documents = text_splitter.split_documents(documents)

            for doc in documents:
                file_path = doc.metadata.get("file_path", "")
                transcript_id = file_path.split("transcript_")[-1].split(".txt")[0]
                yt_link = f"https://www.youtube.com/watch?v={transcript_id}"
                doc.metadata["yt_link"] = yt_link

            logger.info(
                f"Loaded {len(documents)} documents from {transcript_directory}"
            )
            return documents
        except Exception as e:
            logger.error(f"Error loading documents from directory: {e}")
            raise

    def get_vector_store_from_connection_string(
        self, db_name: str, collection_name: str, index_name: str
    ):
        try:
            vector_search = MongoDBAtlasVectorSearch.from_connection_string(
                ATLAS_CONNECTION_STRING,
                f"{db_name}.{collection_name}",
                self.embed_model,
                index_name=index_name,
            )
            logger.info("Vector store index retrieved successfully")
            return vector_search
        except Exception as e:
            logger.error(f"Error retrieving vector store: {e}")
            raise


# Main script to load transcripts and create vector store

# MongoDB connection details
mongo_uri = ATLAS_CONNECTION_STRING
db_name = "SIH"
collection_name = "transcripts"
index_name = "transcripts"


embed_model = AzureOpenAIEmbeddings(
    openai_api_version=ADA_VERSION,
    base_url=ADA_BASE_URL,
    openai_api_key=ADA_API_KEY,
)

# Path to the directory containing transcript text files
transcript_directory = "./data"

# Initialize VectorStoreManager
vector_store_manager = VectorStoreManager(
    mongo_uri=mongo_uri, db_name=db_name, embed_model=embed_model
)


# Load transcripts from the directory
documents = vector_store_manager.transcripts_from_directory(transcript_directory)

# Print document details
if documents:
    print(f"Loaded {len(documents)} documents")
    for doc in documents:
        assert hasattr(doc, "page_content"), "Document does not have 'page_content'"
        print(f"Document Type: {type(doc)}")
        print(
            f"Document Content: {doc.page_content[:100]}"
        )  # Print first 100 characters

    # Create vector store from documents
    vector_store_manager.create_vector_store_from_documents(
        collection_name=collection_name, index_name=index_name, documents=documents
    )


else:
    print("No documents were loaded.")


# Retrieve and index the documents
vector_search = vector_store_manager.get_vector_store_from_connection_string(
    db_name=db_name, collection_name=collection_name, index_name=index_name
)

# import os
# import logging
# from pymongo import MongoClient
# from langchain_core.documents import Document
# from langchain_community.document_loaders import PyMuPDFLoader
# from langchain_openai import AzureOpenAIEmbeddings
# from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch
# from dotenv import load_dotenv

# load_dotenv()
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# ATLAS_CONNECTION_STRING = os.environ.get("ATLAS_CONNECTION_STRING")
# ADA_BASE_URL = os.environ.get("AOAI_TE3S_BASE_URL")
# ADA_API_KEY = os.environ.get("AOAI_TE3S_KEY")
# ADA_VERSION = os.environ.get("AOAI_TE3S_VERSION")
# ADA_MODEL = os.environ.get("AOAI_TE3S_MODEL")
# ADA_DEPLOYMENT = os.environ.get("AOAI_TE3S_DEPLOYMENT")


# class PDFLoader:
#     def __init__(self, file_path: str):
#         self.file_path = file_path

#     def lazy_load(self):
#         for file_name in os.listdir(self.file_path):
#             if file_name.endswith(".pdf"):
#                 full_path = os.path.join(self.file_path, file_name)
#                 pdf_loader = PyMuPDFLoader(full_path)
#                 documents = pdf_loader.load()
#                 for document in documents:
#                     document.metadata["file_path"] = full_path
#                     document.metadata["file_name"] = file_name
#                     yield document

#     def load(self):
#         return list(self.lazy_load())


# class VectorStoreManager:
#     def __init__(self, mongo_uri: str, db_name: str, embed_model):
#         self.client = MongoClient(mongo_uri)
#         self.db = self.client[db_name]
#         self.embed_model = embed_model

#     def create_vector_store_from_documents(
#         self, collection_name: str, index_name: str, documents: list
#     ):
#         if not documents:
#             raise ValueError("The documents list cannot be empty.")

#         try:
#             collection = self.db[collection_name]
#             vector_search = MongoDBAtlasVectorSearch(
#                 embedding=self.embed_model,
#                 collection=collection,
#                 index_name=index_name,
#                 relevance_score_fn="cosine",
#             )

#             vector_search.add_documents(documents)
#             logger.info("Vector store created successfully")

#             # Log the documents being added
#             logger.info(f"Documents added to collection '{collection_name}':")
#             for doc in documents:
#                 logger.info(doc.metadata)

#             return vector_search
#         except Exception as e:
#             logger.error(f"Error creating vector store: {e}")
#             raise

#     @staticmethod
#     def pdfs_from_directory(pdf_directory: str):
#         try:
#             reader = PDFLoader(file_path=pdf_directory)
#             documents = reader.load()

#             for doc in documents:
#                 file_path = doc.metadata.get("file_path", "")
#                 doc.metadata["source"] = "PDF"

#             logger.info(f"Loaded {len(documents)} documents from {pdf_directory}")
#             return documents
#         except Exception as e:
#             logger.error(f"Error loading PDF documents from directory: {e}")
#             raise

#     def get_vector_store_from_connection_string(
#         self, db_name: str, collection_name: str, index_name: str
#     ):
#         try:
#             vector_search = MongoDBAtlasVectorSearch.from_connection_string(
#                 ATLAS_CONNECTION_STRING,
#                 f"{db_name}.{collection_name}",
#                 self.embed_model,
#                 index_name=index_name,
#             )
#             logger.info("Vector store index retrieved successfully")
#             return vector_search
#         except Exception as e:
#             logger.error(f"Error retrieving vector store: {e}")
#             raise


# # Main script to load PDFs and create vector store

# # MongoDB connection details
# mongo_uri = ATLAS_CONNECTION_STRING
# db_name = "BEST"

# # PDF collection details
# pdf_collection_name = "pdf"
# pdf_index_name = "pdf"

# embed_model = AzureOpenAIEmbeddings(
#     openai_api_version=ADA_VERSION,
#     base_url=ADA_BASE_URL,
#     openai_api_key=ADA_API_KEY,
# )

# # Path to the directory containing PDF files
# pdf_directory = "./data/pdfs"

# # Initialize VectorStoreManager
# vector_store_manager = VectorStoreManager(
#     mongo_uri=mongo_uri, db_name=db_name, embed_model=embed_model
# )

# # Load PDFs from the directory
# pdf_documents = vector_store_manager.pdfs_from_directory(pdf_directory)

# # Print document details
# if pdf_documents:
#     print(f"Loaded {len(pdf_documents)} PDF documents")
#     for doc in pdf_documents:
#         assert hasattr(doc, "page_content"), "Document does not have 'page_content'"
#         print(f"Document Type: {type(doc)}")
#         print(
#             f"Document Content: {doc.page_content[:100]}"
#         )  # Print first 100 characters

#     # Create vector store from PDF documents
#     vector_store_manager.create_vector_store_from_documents(
#         collection_name=pdf_collection_name,
#         index_name=pdf_index_name,
#         documents=pdf_documents,
#     )
# else:
#     print("No PDF documents were loaded.")

# # Retrieve and index the PDF documents
# pdf_vector_search = vector_store_manager.get_vector_store_from_connection_string(
#     db_name=db_name,
#     collection_name=pdf_collection_name,
#     index_name=pdf_index_name,
# )
