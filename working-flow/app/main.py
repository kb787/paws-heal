from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from routers.admin_router import router as admin_router
from routers.rag_router import router as rag_router
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Paws Heal API", version="1.0.0")


@app.middleware("http")
async def capture_user_ip(request: Request, call_next):
    # Capture user IP address from request
    user_ip = request.client.host

    # Store user IP in the request state
    request.state.user_ip = user_ip

    # Proceed with the request
    response = await call_next(request)
    return response


# CORS settings for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://siva-ai-9ijl.onrender.com", "http://localhost:5173", "http://localhost", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin_router, prefix="/admin", tags=["Admin Panel"])
app.include_router(rag_router, prefix="/rag", tags=["RAG Chatbot"])


@app.get("/")
async def root():
    return {"message": "Unified API for Admin Panel and RAG Chatbot"}

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker and monitoring"""
    try:
        # Add any additional health checks here
        return {
            "status": "healthy",
            "version": "1.0.0",
            "services": {
                "api": "up",
                "database": "up"  # Add actual database check if needed
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Service unhealthy")
