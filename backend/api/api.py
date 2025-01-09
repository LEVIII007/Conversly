from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from typing import List
from pydantic import BaseModel

import embed
from web import fetch_urls
from doc import process_documents

app = FastAPI()


class UploadRequest(BaseModel):
    chatbotID: str
    websiteURL: List[str]


@app.post("/process")
async def process(
    chatbotID: str = Form(...),
    websiteURL: str = Form(...),
    documents: List[UploadFile] = File(...),
):
    print("Processing request...")
    print(f"chatbotID: {chatbotID}")
    print(f"websiteURL: {websiteURL}")
    print(f"documents: {documents}")
    try:
        # Parse website URLs
        try:
            website_urls = eval(websiteURL)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid website URL format.")

        # Validate chatbotID
        if not chatbotID:
            raise HTTPException(status_code=400, detail="chatbotID is required.")

        # Fetch content from websites
        try:
            content = await fetch_urls(website_urls)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching website content: {str(e)}")

        # Embed website content
        try:
            for pages in content:
                embed.embed(pages, chatbotID)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error embedding website content: {str(e)}")

        # Process uploaded documents
        try:
            documents_content = await process_documents(documents)
        except HTTPException as e:
            raise e  # Propagate file format errors
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing documents: {str(e)}")

        # Embed document content
        try:
            for doc in documents_content:
                embed.embed(doc, chatbotID)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error embedding document content: {str(e)}")

        return {"status": "success"}

    except HTTPException as http_err:
        # Gracefully return HTTPExceptions
        return {"status": "error", "detail": http_err.detail}

    except Exception as general_err:
        # Catch-all for unexpected errors
        return {"status": "error", "detail": f"An unexpected error occurred: {str(general_err)}"}
