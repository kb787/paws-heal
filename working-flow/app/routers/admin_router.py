from fastapi import APIRouter
from backend.app.routers.youtube_router import router as youtube_router
from backend.app.routers.pdf_router import router as pdf_router
from backend.app.routers.scrapy_router import router as scrapy_router

router = APIRouter()

router.include_router(youtube_router, prefix="/youtube")
router.include_router(pdf_router, prefix="/pdf")
router.include_router(scrapy_router, prefix="/scrapy")
