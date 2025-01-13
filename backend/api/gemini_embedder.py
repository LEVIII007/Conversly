import google.generativeai as genai
import os
import dotenv

dotenv.load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

genai.configure(api_key=GEMINI_API_KEY)

class DocumentEmbedder:
    def __init__(self, model_name= "models/text-embedding-004"):
        self.model_name = model_name

    def embed_documents(self, document):
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=document
        )
        embedding = response['embedding']
        return embedding