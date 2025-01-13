from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from typing import List
from pydantic import BaseModel

from pgembed import embed, batch_store_embeddings
from web import fetch_urls
from doc import process_documents

app = FastAPI()


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
        
        # Parse website URLs and Q&A data
        website_urls = eval(websiteURL) if websiteURL else []
        qa_pairs = [eval(qa) for qa in qandaData] if qandaData else []

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
    
