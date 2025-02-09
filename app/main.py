from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routers.admin_router import router as admin_router
from app.routers.rag_router import router as rag_router

app = FastAPI()


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
    allow_origins=["https://siva-ai-9ijl.onrender.com", "http://localhost:5173"],
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
