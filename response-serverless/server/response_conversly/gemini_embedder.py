# import google.generativeai as genai
# import os
# from dotenv import load_dotenv
# from typing import List
# import logging

# load_dotenv()

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# DATABASE_URL = os.getenv("DATABASE_URL")

# genai.configure(api_key=GEMINI_API_KEY)
# model = genai.GenerativeModel("gemini-1.5-flash-latest")

# logger = logging.getLogger(__name__)

# class DocumentEmbedder:
#     def __init__(self, model_name="models/text-embedding-004"):
#         genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
#         self.model_name = model_name
    
#     async def embed_content(self, text: str) -> List[float]:
#         try:
#             response = genai.embed_content(
#                 model=self.model_name,
#                 content=text
#             )
#             return response['embedding']
#         except Exception as e:
#             logger.error(f"Error generating embedding: {e}")
#             return [0] * 1536  # Return zero vector on error
    




