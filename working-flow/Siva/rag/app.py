from fastapi import FastAPI, HTTPException, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Siva.rag.rag.inference.chat import ChatService
import logging

# Create FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://localhost:3000",
        "http://frontend:3001",
        "http://voice-frontend:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

chat_service = ChatService()
router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QueryRequest(BaseModel):
    user_query: str
    userId: str  # Add userId as a required field


db_name = "wildlife"
collection_name = "pdfs"


@router.post("/query")
async def query_endpoint(request: Request, query_request: QueryRequest):
    try:
        # Retrieve user_ip from middleware
        user_ip = request.state.user_ip
        logger.info(f"Received query from IP {user_ip}, userId: {query_request.userId}: {query_request.user_query}")
        
        response = chat_service.chat(
            query_request.user_query, 
            db_name, 
            collection_name, 
            user_ip=user_ip,
            user_id=query_request.userId  # Pass userId to the chat method
        )

        return response
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing query: {str(e)}"
        )

# Include the router in the app
app.include_router(router)

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
