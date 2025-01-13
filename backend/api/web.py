from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from fastapi import HTTPException

async def fetch_urls(urls: list[str]) -> list[str]:
    if not urls:
        return []
        
    try:
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
                        contents.append("")
                except Exception as e:
                    print(f"Error processing {url}: {str(e)}")
                    contents.append("")
                    
        return contents
    except Exception as e:
        print(f"Error in fetch_urls: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching URLs: {str(e)}")
