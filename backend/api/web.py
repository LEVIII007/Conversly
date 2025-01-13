from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

async def fetch_urls(urls: list[str]) -> list[str]:
    """
    Fetch content from multiple URLs
    
    Args:
        urls: List of URLs to fetch
        
    Returns:
        List of markdown content from each URL
    """
    config = CrawlerRunConfig(
        markdown_generator=DefaultMarkdownGenerator(
            options={
                "ignore_links": True,
                "escape_html": False,
                "body_width": 80
            }
        )
    )
    
    contents = []
    async with AsyncWebCrawler() as crawler:
        for url in urls:
            try:
                result = await crawler.arun(url, config=config)
                if result.success:
                    contents.append(result.markdown)
                else:
                    print(f"Failed to crawl {url}: {result.error_message}")
                    contents.append("")  # Empty string for failed URLs
            except Exception as e:
                print(f"Error processing {url}: {str(e)}")
                contents.append("")
    
    return contents
