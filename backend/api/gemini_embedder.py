import google.generativeai as genai
import os
import dotenv

dotenv.load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash-latest")


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
    

def clean_text(texts):
    cleaned_texts = []
    for text in texts:
        response = model.generate_content(
            f"Clean the following web scrapped text, extract all the relevant information and return it in a structured format. {text}",
             generation_config = genai.GenerationConfig(
            max_output_tokens=1000,
            )
        )
        cleaned_texts.append(response.text)
    return cleaned_texts





