import os
import logging
from fastapi import File, UploadFile
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Embedding model and MongoDB configurations
embed_model = AzureOpenAIEmbeddings(
    openai_api_version=os.getenv("AOAI_TE3S_VERSION"),
    base_url=os.getenv("AOAI_TE3S_BASE_URL"),
    openai_api_key=os.getenv("AOAI_TE3S_KEY"),
)
MONGO_URI = os.getenv("ATLAS_CONNECTION_STRING")
DB_NAME = "SIH"
COLLECTION_NAME = "pdfs"
INDEX_NAME = "pdfs"


# PDF file processing and ingestion logic
async def process_pdf_and_embed(pdf_input):
    """Process uploaded PDF, generate embeddings, and store in the vector DB."""
    temp_pdf_path = None
    try:
        # Enhanced type checking and debugging
        print(f"Input type: {type(pdf_input)}")

        # Specific handling for FastAPI UploadFile
        if hasattr(pdf_input, "file") and hasattr(pdf_input, "filename"):
            # Use tempfile to create a secure temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_pdf_path = temp_file.name

                # Read file content
                content = await pdf_input.read()
                temp_file.write(content)

            # Load the PDF using PyPDFLoader
            pdf_loader = PyPDFLoader(temp_pdf_path)
            pdf_documents = pdf_loader.load()

            # Add metadata
            for doc in pdf_documents:
                doc.metadata["source"] = "PDF"
                doc.metadata["file_name"] = pdf_input.filename
                doc.metadata["file_path"] = temp_pdf_path

        elif isinstance(pdf_input, str):
            if not os.path.exists(pdf_input):
                raise ValueError(f"File path {pdf_input} does not exist.")

            pdf_loader = PyPDFLoader(pdf_input)
            pdf_documents = pdf_loader.load()

            # Add metadata for file path input
            for doc in pdf_documents:
                doc.metadata["source"] = "PDF"
                doc.metadata["file_name"] = os.path.basename(pdf_input)
                doc.metadata["file_path"] = pdf_input

        else:
            # Detailed error for unsupported input type
            raise ValueError(
                f"Unsupported input type for PDF processing. Received type: {type(pdf_input)}"
            )

        # Rest of the function remains the same...
        # Split documents for better ingestion
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=100
        )
        pdf_documents = text_splitter.split_documents(pdf_documents)

        # Ingest documents into vector database
        if pdf_documents:
            create_vector_store_from_documents(
                COLLECTION_NAME, INDEX_NAME, pdf_documents
            )

            logger.info(
                f"Processed and ingested {len(pdf_documents)} PDF documents successfully."
            )

        return {"message": "PDF processed successfully"}

    except Exception as e:
        logger.error(f"Error processing PDFs: {e}")
        raise
    finally:
        # Ensure temporary file is deleted
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            try:
                os.unlink(temp_pdf_path)
            except Exception as cleanup_error:
                logger.error(f"Error cleaning up temp file: {cleanup_error}")


# Helper function to create vector store from documents
def create_vector_store_from_documents(collection_name, index_name, documents):
    """Generate embeddings and store in the vector database."""
    if not documents:
        raise ValueError("No documents provided for embedding.")

    try:
        client = MongoClient(MONGO_URI)
        collection = client[DB_NAME][collection_name]
        vector_search = MongoDBAtlasVectorSearch(
            embedding=embed_model,
            collection=collection,
            index_name=index_name,
            relevance_score_fn="cosine",
        )
        vector_search.add_documents(documents)
        logger.info(
            f"Successfully added {len(documents)} documents to the vector store."
        )
    except Exception as e:
        logger.error(f"Error adding documents to vector store: {e}")
        raise
