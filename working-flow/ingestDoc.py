# import os
# import asyncio
# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from lightrag import LightRAG
# from lightrag.llm import gpt_4o_mini_complete
# import pandas as pd
# from langchain_core.messages import HumanMessage
# from langchain_openai import AzureChatOpenAI
# from dotenv import load_dotenv
# import aiofiles
# import logging
# from motor.motor_asyncio import AsyncIOMotorClient
# from datetime import datetime
# import numpy as np

# # Configure logging
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

# # Load environment variables
# load_dotenv()

# # MongoDB Configuration
# MONGO_URI = "mongodb+srv://dhruvpatel150204:internship123@cluster0.ec2du.mongodb.net/"
# DATABASE_NAME = "SIH"
# CSV_COLLECTION = "csv"
# TEXT_COLLECTION = "txt"
# KG_STORE_COLLECTION = "kg_store"

# # Azure OpenAI Configuration
# api_key = os.getenv("AZURE_OPENAI_API_KEY")
# azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
# deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT")
# api_version = os.getenv("AZURE_OPENAI_API_VERSION")

# # Initialize Chat Model
# chat_model = AzureChatOpenAI(
#     api_key=api_key,
#     azure_endpoint=azure_endpoint,
#     api_version=api_version,
#     deployment_name=deployment_name,
# )

# class MongoDBManager:
#     def __init__(self, uri, database_name):
#         self.client = AsyncIOMotorClient(uri)
#         self.db = self.client[database_name]
    
#     async def store_csv(self, filename, content):
#         """Store original CSV content"""
#         document = {
#             "filename": filename,
#             "content": content,
#             "upload_date": datetime.utcnow()
#         }
#         result = await self.db[CSV_COLLECTION].insert_one(document)
#         return str(result.inserted_id)
    
#     async def store_text(self, csv_id, filename, text_content):
#         """Store converted text content"""
#         document = {
#             "csv_id": csv_id,
#             "original_filename": filename,
#             "text_content": text_content,
#             "conversion_date": datetime.utcnow()
#         }
#         result = await self.db[TEXT_COLLECTION].insert_one(document)
#         return str(result.inserted_id)
    
#     async def store_embeddings(self, text_id, embeddings):
#         """Store embeddings for the text"""
#         document = {
#             "text_id": text_id,
#             "embeddings": embeddings.tolist(),
#             "created_at": datetime.utcnow()
#         }
#         result = await self.db[KG_STORE_COLLECTION].insert_one(document)
#         return str(result.inserted_id)

# class MongoRAG(LightRAG):
#     def __init__(self, mongodb_manager, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.mongodb = mongodb_manager
    
#     async def ainsert(self, text_id, content):
#         """Custom insert to store embeddings in MongoDB"""
#         embeddings = await self._get_embeddings(content)
#         await self.mongodb.store_embeddings(text_id, embeddings)
#         return embeddings

# async def process_csv_to_text(file: UploadFile, mongodb_manager: MongoDBManager) -> dict:
#     """Process CSV file and store all components in MongoDB"""
#     # Save uploaded file temporarily
#     temp_file = f"temp_uploads/{file.filename}"
#     os.makedirs("temp_uploads", exist_ok=True)
    
#     try:
#         async with aiofiles.open(temp_file, "wb") as f:
#             content = await file.read()
#             await f.write(content)

#         # Store original CSV
#         csv_content = pd.read_csv(temp_file).to_dict()
#         csv_id = await mongodb_manager.store_csv(file.filename, str(csv_content))

#         # Process CSV to text
#         data = pd.read_csv(temp_file)
#         headers = data.columns.tolist()
#         summaries = []

#         for index, row in data.iterrows():
#             row_data = [str(val) if pd.notna(val) else "" for val in row]
#             combined_text = ". ".join([f"{header}: {value}" for header, value in zip(headers, row_data)])

#             message = HumanMessage(content=(
#                 f"Summarize the following row of data into a concise paragraph: {combined_text}"
#             ))
#             response = chat_model.invoke([message])
#             summaries.append(f"{index + 1}: {response.content.strip()}\n")

#         full_text = "\n\n".join(summaries)
        
#         # Store converted text
#         text_id = await mongodb_manager.store_text(csv_id, file.filename, full_text)
        
#         return {"csv_id": csv_id, "text_id": text_id, "content": full_text}

#     finally:
#         if os.path.exists(temp_file):
#             os.remove(temp_file)

# # FastAPI app initialization
# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize MongoDB manager and RAG
# mongodb_manager = MongoDBManager(MONGO_URI, DATABASE_NAME)
# rag = MongoRAG(
#     mongodb_manager=mongodb_manager,
#     working_dir="./temp",
#     llm_model_func=gpt_4o_mini_complete,
# )

# @app.post("/ingest")
# async def ingest_document(file: UploadFile):
#     """Endpoint to process and ingest a document"""
#     if not file:
#         raise HTTPException(status_code=400, detail="No file uploaded.")

#     try:
#         # Process file and store in MongoDB
#         result = await process_csv_to_text(file, mongodb_manager)
        
#         # Generate and store embeddings
#         await rag.ainsert(result["text_id"], result["content"])
        
#         return JSONResponse({
#             "message": f"Document {file.filename} processed and ingested successfully!",
#             "csv_id": result["csv_id"],
#             "text_id": result["text_id"]
#         })

#     except Exception as e:
#         logger.error(f"Error during ingestion: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error during ingestion: {str(e)}")



import os
import json
import asyncio
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from lightrag import LightRAG
from lightrag.llm import gpt_4o_mini_complete
import pandas as pd
from langchain_core.messages import HumanMessage
from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv
import aiofiles
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGO_URI = "mongodb+srv://dhruvpatel150204:internship123@cluster0.ec2du.mongodb.net/"
DATABASE_NAME = "SIH"
CSV_COLLECTION = "csv"
TEXT_COLLECTION = "txt"
KG_STORE_COLLECTION = "kg-store"

# Azure OpenAI Configuration
api_key = os.getenv("AZURE_OPENAI_API_KEY")
azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT")
api_version = os.getenv("AZURE_OPENAI_API_VERSION")

# Initialize Chat Model
chat_model = AzureChatOpenAI(
    api_key=api_key,
    azure_endpoint=azure_endpoint,
    api_version=api_version,
    deployment_name=deployment_name,
)

# FastAPI app initialization
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MongoDBManager:
    def __init__(self, uri, database_name):
        self.client = AsyncIOMotorClient(uri)
        self.db = self.client[database_name]
    
    async def check_document_exists(self, filename):
        """Check if a document with the same filename exists"""
        existing_doc = await self.db[CSV_COLLECTION].find_one({"filename": filename})
        if existing_doc:
            return True, str(existing_doc['_id'])
        return False, None
    
    async def store_csv(self, filename, content):
        """Store original CSV content"""
        document = {
            "filename": filename,
            "content": content,
            "upload_date": datetime.utcnow()
        }
        result = await self.db[CSV_COLLECTION].insert_one(document)
        return str(result.inserted_id)
    
    async def store_text(self, csv_id, filename, text_content):
        """Store converted text content"""
        document = {
            "csv_id": csv_id,
            "original_filename": filename,
            "text_content": text_content,
            "conversion_date": datetime.utcnow()
        }
        result = await self.db[TEXT_COLLECTION].insert_one(document)
        return str(result.inserted_id)
    
    async def store_kg_file(self, text_id, filename, file_content):
        """Store files generated during RAG processing in kg-store collection"""
        document = {
            "text_id": text_id,
            "filename": filename,
            "content": file_content,
            "created_at": datetime.utcnow()
        }
        result = await self.db[KG_STORE_COLLECTION].insert_one(document)
        return str(result.inserted_id)

class MongoRAG(LightRAG):
    def __init__(self, mongodb_manager, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.mongodb = mongodb_manager

async def process_csv_to_text(file: UploadFile, mongodb_manager: MongoDBManager) -> dict:
    """Process CSV file and store all components in MongoDB"""
    # Save uploaded file temporarily
    temp_file = f"temp_uploads/{file.filename}"
    os.makedirs("temp_uploads", exist_ok=True)
    
    try:
        async with aiofiles.open(temp_file, "wb") as f:
            content = await file.read()
            await f.write(content)

        # Store original CSV
        csv_content = pd.read_csv(temp_file).to_dict()
        csv_id = await mongodb_manager.store_csv(file.filename, str(csv_content))

        # Process CSV to text
        data = pd.read_csv(temp_file)
        headers = data.columns.tolist()
        summaries = []

        for index, row in data.iterrows():
            row_data = [str(val) if pd.notna(val) else "" for val in row]
            combined_text = ". ".join([f"{header}: {value}" for header, value in zip(headers, row_data)])

            message = HumanMessage(content=(
                f"Summarize the following row of data into a concise paragraph: {combined_text}"
            ))
            response = chat_model.invoke([message])
            summaries.append(f"{index + 1}: {response.content.strip()}\n")

        full_text = "\n\n".join(summaries)
        
        # Store converted text
        text_id = await mongodb_manager.store_text(csv_id, file.filename, full_text)
        
        return {"csv_id": csv_id, "text_id": text_id, "content": full_text}

    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

# FastAPI app initialization
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MongoDB manager and RAG
mongodb_manager = MongoDBManager(MONGO_URI, DATABASE_NAME)
rag = MongoRAG(
    mongodb_manager=mongodb_manager,
    working_dir="./temp",
    llm_model_func=gpt_4o_mini_complete,
)

@app.post("/ingest")
async def ingest_document(file: UploadFile):
    """Endpoint to process and ingest a document"""
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    try:
        # Check if document already exists
        exists, existing_id = await mongodb_manager.check_document_exists(file.filename)
        
        if exists:
            return JSONResponse({
                "message": "This document is already in use",
                "existing_id": existing_id
            }, status_code=409)  # 409 Conflict status code
        
        # Process file and store in MongoDB
        result = await process_csv_to_text(file, mongodb_manager)
        
        # Execute RAG processing
        await rag.ainsert(result["content"])
        
        # Store generated files from RAG working directory in kg-store
        try:
            # Get list of files in the working directory
            rag_files = os.listdir(rag.working_dir)
            
            for filename in rag_files:
                file_path = os.path.join(rag.working_dir, filename)
                
                # Read file content
                with open(file_path, 'r') as f:
                    file_content = f.read()
                
                # Store file in kg-store collection
                await mongodb_manager.store_kg_file(
                    text_id=result["text_id"], 
                    filename=filename, 
                    file_content=file_content
                )
        except Exception as file_store_error:
            logger.error(f"Error storing RAG files: {str(file_store_error)}")
        
        return JSONResponse({
            "message": f"Document {file.filename} processed and ingested successfully!",
            "csv_id": result["csv_id"],
            "text_id": result["text_id"]
        })

    except Exception as e:
        logger.error(f"Error during ingestion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during ingestion: {str(e)}")