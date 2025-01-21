from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from fastapi import HTTPException
from crawl4ai.content_filter_strategy import PruningContentFilter

async def fetch_urls(urls: list[str]) -> list[str]:
    if not urls:
        return []
        
    try:
        config = CrawlerRunConfig(
            markdown_generator=DefaultMarkdownGenerator(
                content_filter=PruningContentFilter(threshold=0.6),
            options={"ignore_links": True, "body_width": 1000, "escape_html": True, "skip_internal_links": True}
            )
        )
        
        contents = []
        async with AsyncWebCrawler() as crawler:
            for url in urls:
                try:
                    result = await crawler.arun(url, config=config)
                    if result.success:
                        md_object = result.markdown_v2
                        contents.append(md_object.fit_markdown)
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
