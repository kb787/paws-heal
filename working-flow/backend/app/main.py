from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import pdf_router, scrapy_router, youtube_router

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

# Include routers
app.include_router(pdf_router.router)
app.include_router(scrapy_router.router)
app.include_router(youtube_router.router)

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 