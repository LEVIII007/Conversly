import os
import psycopg2
import google.generativeai as genai
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

genai.configure(api_key=GEMINI_API_KEY)

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)


# Mock API key validation function
def validate_api_key(api_key: str):
    """
    Validates API key against the database and returns chatbot info
    """
    try:
        conn = get_db_connection()
        query = """
        SELECT id, name, api_key
        FROM "ChatBot"
        WHERE api_key = %s;
        """
        
        with conn.cursor() as cursor:
            cursor.execute(query, (api_key,))
            result = cursor.fetchone()
            
            if not result:
                raise HTTPException(status_code=401, detail="Invalid API key")
                
            return {
                "chatbotID": str(result[0]),  # Convert ID to string
                "name": result[1]
            }
            
    except Exception as e:
        print(f"Error validating API key: {str(e)}")
        raise HTTPException(status_code=500, detail="Error validating API key")
    finally:
        conn.close()

def search_documentation(prompt: str, chatbot_id: str, limit: int = 3):
    try:
        # Get embedding for the search query
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=prompt
        )
        query_embedding = response['embedding']

        query = """
            SELECT topic, text
            FROM "embeddings" 
            WHERE "chatbotid" = %s
            ORDER BY embedding <=> %s::vector
            LIMIT %s;
        """
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, (chatbot_id, str(query_embedding), limit))
                results = cursor.fetchall()

                if not results:
                    return ""

                context_string = "\n\nRelevant Context:\n"
                for idx, row in enumerate(results, 1):
                    topic = str(row[0])
                    text = str(row[1])
                    context_string += f"\nSection {idx} (from {topic}):\n{text}\n"

                return context_string

        finally:
            conn.close()

    except Exception as e:
        print(f"Error in search_documentation: {str(e)}")
        raise

