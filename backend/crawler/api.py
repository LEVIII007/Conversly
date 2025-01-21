from fastapi import FastAPI, HTTPException

from web import fetch_urls

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

@app.post("/crawl")
async def chat(
):
   
    return await fetch_urls(urls)