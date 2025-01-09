# import asyncio
from crawl4ai import AsyncWebCrawler

# async def main():
#     async with AsyncWebCrawler() as crawler:
#         result = await crawler.arun(
#             url="https://www.nbcnews.com/business",
#         )
#         print(result.markdown)
#         return result

# asyncio.run(main())
async def fetch_urls(urls):
    async with AsyncWebCrawler() as crawler:
        results = []
        for url in urls:
            result = await crawler.arun(url=url)
            results.append(result.markdown)
        return results


# will add ai in scrapping for better results