from fastapi import APIRouter
from Siva.rag.app import router as SivaRouter


router = APIRouter()


router.include_router(SivaRouter, prefix="/siva")
 