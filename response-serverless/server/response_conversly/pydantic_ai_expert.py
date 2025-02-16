from __future__ import annotations as _annotations

import asyncpg

from dataclasses import dataclass
import os

from pydantic_ai import Agent, RunContext # type: ignore
from pydantic_ai.models.openai import OpenAIModel # type: ignore
from openai import AsyncOpenAI
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from .db_queries import search_documentation, list_documentation_pages, get_page_content
from dotenv import load_dotenv

load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# Manually read .env file


app = FastAPI()


# Configure OpenAI for chat
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))



llm = os.getenv('LLM_MODEL', 'gpt-3.5-turbo')
model = OpenAIModel(llm)


class ResultType(BaseModel):
    response : str
    citations : List[str]

@dataclass
class PydanticAIDeps:
    openai_client: AsyncOpenAI
    chatbotId: int

system_prompt = """
You are an expert at answering questions based on the provided documentation.
Always make sure you look at the documentation with the provided tools before answering.
When you first look at the documentation, always start with RAG.
Then check the list of available documentation pages and retrieve content if needed.
Always be honest when you don't find relevant information.
"""

pydantic_ai_expert = Agent(
    OpenAIModel("gpt-4-turbo"),
    system_prompt=system_prompt,
    deps_type=PydanticAIDeps,
    result_type=ResultType,
)



@pydantic_ai_expert.tool
async def retrieve_relevant_documentation(ctx: RunContext[PydanticAIDeps], query: str) -> str:
    print(f"Query: {query}")
    print(f"ChatbotId: {ctx.deps.chatbotId}")
    """Retrieve relevant documentation chunks based on the query along with their citations."""
    return await search_documentation( query, ctx.deps.chatbotId)

@pydantic_ai_expert.tool
async def get_available_pages(ctx: RunContext[PydanticAIDeps]) -> List[str]:
    """Get list of all available documentation pages. they can be used to retrieve content and can also act as citations for the response."""  
    return await list_documentation_pages(ctx.deps.chatbotId)

@pydantic_ai_expert.tool
async def get_page_details(ctx: RunContext[PydanticAIDeps], url: str) -> str:
    """Get full content of a specific documentation page."""
    return await get_page_content(url, ctx.deps.chatbotId)