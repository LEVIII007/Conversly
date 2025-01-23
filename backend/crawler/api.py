from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel, HttpUrl
from web import fetch_urls, crawl_sitemap
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Input validation models
class CrawlRequest(BaseModel):
    urls: List[HttpUrl]

class SitemapRequest(BaseModel):
    url: HttpUrl

app = FastAPI(
    title="Web Crawler API",
    description="API for crawling websites and processing their content",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/crawl", response_model=List[str])
async def crawl_urls(request: CrawlRequest):
    """
    Crawl a list of URLs and return their processed content.
    """
    try:
        logger.info(f"Received request to crawl {len(request.urls)} URLs")
        results = await fetch_urls([str(url) for url in request.urls])
        return results
    except Exception as e:
        logger.error(f"Error in crawl endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/website-url", response_model=List[str])
async def crawl_website(request: SitemapRequest):
    """
    Crawl an entire website using its sitemap.
    """
    try:
        logger.info(f"Received request to crawl sitemap: {request.url}")
        results = await crawl_sitemap(str(request.url))
        return results
    except Exception as e:
        logger.error(f"Error in website-url endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)