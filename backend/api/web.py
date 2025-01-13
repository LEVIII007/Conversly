# import asyncio
from crawl4ai import AsyncWebCrawler



# # async def main():
# #     async with AsyncWebCrawler() as crawler:
# #         result = await crawler.arun(
# #             url="https://www.nbcnews.com/business",
# #         )
# #         print(result.markdown)
# #         return result

# asyncio.run(main())
async def fetch_urls(urls):
    async with AsyncWebCrawler() as crawler:
        results = []
        for url in urls:
            result = await crawler.arun(url=url)
            results.append(result.markdown)
        print(results)
        return results


# will add ai in scrapping for better results

# import asyncio
# from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
# from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

# async def main():
#     config = CrawlerRunConfig(
#         markdown_generator=DefaultMarkdownGenerator(
#              options={
#             "ignore_links": True,
#             "escape_html": False,
#             "body_width": 80
#         }
#         )
#     )
#     async with AsyncWebCrawler() as crawler:
#         result = await crawler.arun("https://authjs.dev/getting-started/adapters/prisma", config=config)

#         if result.success:
#             print("Raw Markdown Output:\n")
#             print(result.markdown)  # The unfiltered markdown from the page
#         else:
#             print("Crawl failed:", result.error_message)

# if __name__ == "__main__":
#     asyncio.run(main())