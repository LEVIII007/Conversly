from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
from .gemini import search_documentation

# Define a response model for reusability
class ChatResponse(BaseModel):
    answer: str
    context: Optional[list] = None


# Chat service logic
async def generate_chat_response(question: str, api_key: str) -> ChatResponse:
    try:

        # Step 1: Search for relevant embeddings
        relevant_context = search_documentation(
            prompt=question,
            chatbot_id=api_key,
            limit=3
        )

        # if not relevant_context:
        #     raise HTTPException(status_code=404, detail="No relevant context found for the question.")

        # Step 2: Construct a prompt for Gemini
        prompt = """Based on the following context, answer the user's question. 
        If you cannot find a relevant answer in the context, say so.
        
        Context:
        """
        for ctx in relevant_context:
            prompt += f"\n{ctx['text']}\n"
        
        prompt += f"\nQuestion: {question}\nAnswer:"

        # Step 3: Generate response using Gemini
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        return ChatResponse(
            answer=response.text,
            context=[ctx['text'] for ctx in relevant_context]
        )

    except Exception as e:
        print(f"Error generating chat response: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
