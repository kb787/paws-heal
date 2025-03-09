from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from backend.app.services.scrapy_service import run_spider
import logging
from backend.scrapy_project.spiders.my_spider import MySpider



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


class ScrapeRequest(BaseModel):
    url: HttpUrl
    exclude_domains: list[str] = []
    exclude_keywords: list[str] = []


class CrawlRequest(BaseModel):
    url: HttpUrl
    depth_limit: int
    exclude_domains: list[str] = []
    exclude_keywords: list[str] = []


@router.post("/scrape")
async def scrape_endpoint(request: ScrapeRequest):
    try:
        await run_spider(
            spider=MySpider,
            start_urls=[str(request.url)],
            exclude_domains=request.exclude_domains,
            exclude_keywords=request.exclude_keywords,
            depth_limit=None,
            mode="scrape",
        )
        return {
            "message": "Scraping completed successfully.",
            # "output_files": get_output_files(),
        }
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Scraping failed.")


@router.post("/crawl")
async def crawl_endpoint(request: CrawlRequest):
    try:
        await run_spider(
            spider=MySpider,
            start_urls=[str(request.url)],
            depth_limit=request.depth_limit,
            exclude_domains=request.exclude_domains,
            exclude_keywords=request.exclude_keywords,
            mode="crawl",
        )
        return {
            "message": "Crawling completed successfully.",
            # "output_files": get_output_files(),
        }
    except Exception as e:
        logger.error(f"Crawling failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Crawling failed.")
