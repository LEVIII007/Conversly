from typing import List
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from fastapi import HTTPException
from crawl4ai.content_filter_strategy import PruningContentFilter
import requests
from xml.etree import ElementTree
import logging
# from urllib.parse import urljoin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
        raise HTTPException(status_code=500, detail=f"Error fetching URLs: {str(e)}")

async def crawl_sitemap(sitemap_url: str) -> List[str]:
    """
    Crawl an entire sitemap and process all URLs.
    
    Args:
        sitemap_url (str): URL of the sitemap
        
    Returns:
        List[str]: List of processed markdown content from all URLs
    """
    try:
        urls = get_urls_from_sitemap(sitemap_url)
        if not urls:
            logger.warning(f"No URLs found in sitemap: {sitemap_url}")
            return []

        logger.info(f"Found {len(urls)} URLs in sitemap")
        
        # Configure browser for better performance
        browser_config = BrowserConfig(
            headless=True,
            extra_args=[
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--no-sandbox",
                "--disable-extensions"
            ]
        )

        # Configure crawler
        crawl_config = CrawlerRunConfig(
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
        async with AsyncWebCrawler(config=browser_config) as crawler:
            session_id = "sitemap_session"  # Reuse session for better performance
            
            for url in urls:
                try:
                    result = await crawler.arun(
                        url=url,
                        config=crawl_config,
                        session_id=session_id
                    )
                    
                    if result.success:
                        contents.append(result.markdown_v2.fit_markdown)
                        logger.info(f"Successfully crawled: {url}")
                    else:
                        logger.error(f"Failed to crawl {url}: {result.error_message}")
                        contents.append("")
                except Exception as e:
                    logger.error(f"Error processing {url}: {str(e)}")
                    contents.append("")

        return contents
    except Exception as e:
        logger.error(f"Error in crawl_sitemap: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def get_urls_from_sitemap(sitemap_url: str) -> List[str]:
    """
    Extract all URLs from a sitemap.
    
    Args:
        sitemap_url (str): URL of the sitemap
        
    Returns:
        List[str]: List of URLs found in the sitemap
    """
    try:
        response = requests.get(sitemap_url, timeout=30)
        response.raise_for_status()
        
        # Parse the XML
        root = ElementTree.fromstring(response.content)
        
        # Handle different sitemap formats
        namespaces = {
            'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'xhtml': 'http://www.w3.org/1999/xhtml'
        }
        
        urls = []
        
        # Check for sitemap index
        sitemaps = root.findall('.//ns:loc', namespaces)
        if not sitemaps:
            # Direct sitemap
            urls = [loc.text for loc in root.findall('.//ns:loc', namespaces)]
        else:
            # Sitemap index - fetch each referenced sitemap
            for sitemap in sitemaps:
                sub_sitemap_url = sitemap.text
                try:
                    sub_urls = get_urls_from_sitemap(sub_sitemap_url)
                    urls.extend(sub_urls)
                except Exception as e:
                    logger.error(f"Error processing sub-sitemap {sub_sitemap_url}: {str(e)}")
        
        return urls
    except requests.RequestException as e:
        logger.error(f"Error fetching sitemap {sitemap_url}: {str(e)}")
        return []
    except Exception as e:
        logger.error(f"Error parsing sitemap {sitemap_url}: {str(e)}")
        return []