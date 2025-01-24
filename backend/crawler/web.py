from typing import List
from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from crawl4ai.content_filter_strategy import PruningContentFilter
import os
import sys
import psutil
import asyncio
import requests
from xml.etree import ElementTree
import logging
from flask import Flask, jsonify, request

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
__location__ = os.path.dirname(os.path.abspath(__file__))
__output__ = os.path.join(__location__, "output")

# Append parent directory to system path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)
app = Flask(__name__)

async def fetch_urls(urls: List[str]) -> List[str]:
    """
    Fetch and process content from a list of URLs using crawl4ai.
    
    Args:
        urls (List[str]): List of URLs to crawl
        
    Returns:
        List[str]: List of processed markdown content for each URL
    """
    if not urls:
        return []
        
    try:
        config = CrawlerRunConfig(
            markdown_generator=DefaultMarkdownGenerator(
                content_filter=PruningContentFilter(threshold=0.6),
                options={
                    "ignore_links": True,
                    "body_width": 1000,
                    "escape_html": True,
                    "skip_internal_links": True
                }
            )
        )
        
        contents = []
        async with AsyncWebCrawler() as crawler:
            for url in urls:
                try:
                    logger.info(f"Crawling URL: {url}")
                    result = await crawler.arun(url, config=config)
                    
                    if result.success:
                        md_object = result.markdown_v2
                        contents.append(md_object.fit_markdown)
                        logger.info(f"Successfully crawled: {url}")
                    else:
                        logger.error(f"Failed to crawl {url}: {result.error_message}")
                        contents.append("")
                except Exception as e:
                    logger.error(f"Error processing {url}: {str(e)}")
                    contents.append("")
                    
        return contents
    except Exception as e:
        logger.error(f"Error in fetch_urls: {str(e)}")
        return []

async def crawl_sequential(urls: List[str]) -> List[str]:
    """
    Crawl a list of URLs sequentially with session reuse and return the list of markdown content.
    
    Args:
        urls (List[str]): List of URLs to crawl
        
    Returns:
        List[str]: List of processed markdown content for each URL
    """
    logger.info("\n=== Sequential Crawling with Session Reuse ===")

    browser_config = BrowserConfig(
        headless=True,
        # For better performance in Docker or low-memory environments:
        extra_args=["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
    )

    crawl_config = CrawlerRunConfig(
        markdown_generator=DefaultMarkdownGenerator()
    )

    # Create the crawler (opens the browser)
    crawler = AsyncWebCrawler(config=browser_config)
    await crawler.start()

    contents = []
    try:
        session_id = "session1"  # Reuse the same session across all URLs
        for url in urls:
            result = await crawler.arun(
                url=url,
                config=crawl_config,
                session_id=session_id
            )
            if result.success:
                logger.info(f"Successfully crawled: {url}")
                contents.append(result.markdown_v2.raw_markdown)
            else:
                logger.error(f"Failed: {url} - Error: {result.error_message}")
                contents.append("")
    finally:
        # After all URLs are done, close the crawler (and the browser)
        await crawler.close()
    
    return contents

async def crawl_parallel(urls: List[str], max_concurrent: int = 3) -> List[str]:
    logger.info("\n=== Parallel Crawling with Browser Reuse + Memory Check ===")

    # We'll keep track of peak memory usage across all tasks
    peak_memory = 0
    process = psutil.Process(os.getpid())

    def log_memory(prefix: str = ""):
        nonlocal peak_memory
        current_mem = process.memory_info().rss  # in bytes
        if current_mem > peak_memory:
            peak_memory = current_mem
        logger.info(f"{prefix} Current Memory: {current_mem // (1024 * 1024)} MB, Peak: {peak_memory // (1024 * 1024)} MB")

    # Minimal browser config
    browser_config = BrowserConfig(
        headless=True,
        verbose=False,
        extra_args=["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
    )
    crawl_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    # Create the crawler instance
    crawler = AsyncWebCrawler(config=browser_config)
    await crawler.start()

    contents = []
    try:
        # We'll chunk the URLs in batches of 'max_concurrent'
        for i in range(0, len(urls), max_concurrent):
            batch = urls[i : i + max_concurrent]
            tasks = []

            for j, url in enumerate(batch):
                # Unique session_id per concurrent sub-task
                session_id = f"parallel_session_{i + j}"
                task = crawler.arun(url=url, config=crawl_config, session_id=session_id)
                tasks.append(task)

            # Check memory usage prior to launching tasks
            log_memory(prefix=f"Before batch {i//max_concurrent + 1}: ")

            # Gather results
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Check memory usage after tasks complete
            log_memory(prefix=f"After batch {i//max_concurrent + 1}: ")

            # Evaluate results
            for url, result in zip(batch, results):
                if isinstance(result, Exception):
                    logger.error(f"Error crawling {url}: {result}")
                    contents.append("")
                elif result.success:
                    contents.append(result.markdown_v2.raw_markdown)
                else:
                    logger.error(f"Failed to crawl {url}: {result.error_message}")
                    contents.append("")

    finally:
        logger.info("\nClosing crawler...")
        await crawler.close()
        # Final memory log
        log_memory(prefix="Final: ")
        logger.info(f"\nPeak memory usage (MB): {peak_memory // (1024 * 1024)}")

    return contents

def get_pydantic_ai_docs_urls(sitemap_url: str)-> List[str]:
    """
    Fetches all URLs from the Pydantic AI documentation.
    Uses the sitemap (https://ai.pydantic.dev/sitemap.xml) to get these URLs.
    
    Returns:
        List[str]: List of URLs
    """            
    # sitemap_url = "https://ai.pydantic.dev/sitemap.xml"
    try:
        response = requests.get(sitemap_url)
        response.raise_for_status()
        
        # Parse the XML
        root = ElementTree.fromstring(response.content)
        
        # Extract all URLs from the sitemap
        # The namespace is usually defined in the root element
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = [loc.text for loc in root.findall('.//ns:loc', namespace)]
        
        return urls
    except Exception as e:
        print(f"Error fetching sitemap: {e}")
        return []    