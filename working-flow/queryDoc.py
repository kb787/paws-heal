import os
from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from lightrag import LightRAG
from lightrag import QueryParam  # Import QueryParam
from lightrag.llm import gpt_4o_mini_complete
from ingestDoc import MongoRAG, MongoDBManager

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGO_URI = "mongodb+srv://dhruvpatel150204:internship123@cluster0.ec2du.mongodb.net/"
DATABASE_NAME = "SIH"

# FastAPI app initialization
app = FastAPI(title="Document Query Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MongoDB manager
mongodb_manager = MongoDBManager(MONGO_URI, DATABASE_NAME)

# Initialize RAG
rag = MongoRAG(
    mongodb_manager=mongodb_manager,
    working_dir="./temp",
    llm_model_func=gpt_4o_mini_complete,
)

@app.post("/query")
async def query_document(
    query: str = Form(...), 
    search_type: str = Form("naive")
):
    """
    Endpoint to query ingested documents.
    
    Args:
        query (str): The query text to search for.
        search_type (str, optional): The type of search to perform. Defaults to "naive".
    
    Returns:
        JSONResponse with query results.
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query text is required.")

    try:
        # Create QueryParam with the search type
        query_param = QueryParam(mode=search_type)
        
        # Perform the query
        result = await rag.aquery(query, param=query_param)
        return JSONResponse({search_type: result})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during query: {str(e)}")

# Optionally, add a health check endpoint
@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy"}

# To run the server:
# uvicorn queryDOC:app --port 8001 --reload