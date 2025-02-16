from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from .pydantic_ai_expert import pydantic_ai_expert, PydanticAIDeps
from .db_queries import update_analytics, DatabasePool
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
from mangum import Mangum

load_dotenv()

app = FastAPI()
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.on_event("startup")
async def startup():
    await DatabasePool.get_pool()

@app.on_event("shutdown")
async def shutdown():
    await DatabasePool.close_pool()

class ChatRequest(BaseModel):
    message: str
    chatbotId: str
    prompt: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[str]
    success: bool
    message: Optional[str] = None

@app.post("/response", response_model=ChatResponse)
async def handle_response(request: ChatRequest):
    try:
        deps = PydanticAIDeps(openai_client=openai_client, chatbotId=request.chatbotId)
        
        # Get response from Pydantic AI agent
        result = await pydantic_ai_expert.run(
            request.message,
            deps=deps
        )
        # print(result)
        print(result.data.response)
        print(type(result.data.citations))
        # Update analytics before returning response
        await update_analytics(request.chatbotId, result.data.citations)
        
        return {
            "answer": result.data.response,
            "citations": result.data.citations,
            "success": True
        }
        
    except Exception as e:
        return {
            "answer": "",
            "citations": [],
            "success": False,
            "message": str(e)
        }


handler = Mangum(app)