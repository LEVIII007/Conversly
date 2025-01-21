from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Header
from typing import List
from pydantic import BaseModel
from widget.api import generate_chat_response

from pgembed import embed, batch_store_embeddings
from web import fetch_urls
from doc import process_documents
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
# from mangum import Mangum


app = FastAPI()

# handler = Mangum(app)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    context: Optional[list] = None


class UploadRequest(BaseModel):
    chatbotID: str
    websiteURL: List[str]
    qandaData: List[str]
    documents: List[UploadFile]
    userId: str

@app.post("/process")
async def process(
    userId: str = Form(...),
    chatbotID: str = Form(...),
    websiteURL: str = Form(...),
    qandaData: List[str] = Form(None),
    documents: List[UploadFile] = File(None),
):
    try:
        all_embedding_data = []
        
        # Add debug logging
        print("Received data:", {
            "userId": userId,
            "chatbotID": chatbotID,
            "websiteURL": websiteURL,
            "qandaData": qandaData,
            "documents": [d.filename for d in documents] if documents else []
        })
        
        # Parse website URLs and Q&A data
        try:
            website_urls = eval(websiteURL) if websiteURL else []
            qa_pairs = [eval(qa) for qa in qandaData] if qandaData else []
        except Exception as e:
            print("Error parsing input data:", str(e))
            raise HTTPException(status_code=400, detail=f"Invalid input format: {str(e)}")

        # Process websites
        if website_urls:
            content = await fetch_urls(website_urls)
            for pages, website_url in zip(content, website_urls):
                embedding_data = await embed(pages, chatbotID, userId, 
                                          topic=website_url, 
                                          content_type="website")
                all_embedding_data.append(embedding_data)

        # Process Q&A pairs
        if qa_pairs:
            for qa in qa_pairs:
                qa_content = f"Question: {qa['question']}\nAnswer: {qa['answer']}"
                embedding_data = await embed(qa_content, chatbotID, userId, 
                                          topic=qa['question'], 
                                          content_type="qa")
                all_embedding_data.append(embedding_data)

        # Process documents
        if documents:
            documents_content = await process_documents(documents)
            for document in documents_content:
                embedding_data = await embed(document["content"], chatbotID, userId, 
                                          topic=document["filename"],
                                          content_type=document["type"])
                all_embedding_data.append(embedding_data)

        # Store all embeddings in a single database transaction
        if all_embedding_data:
            batch_store_embeddings(chatbotID, userId, all_embedding_data)

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



@app.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest, 
    x_api_key: str = Header(..., alias="X-API-Key")
):
    try:
        # Call the chat service logic
        print(request.question)
        return await generate_chat_response(question=request.question, api_key=x_api_key)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")