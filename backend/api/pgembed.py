import google.generativeai as genai
import os
import re
import time
import dotenv
import psycopg2
from psycopg2.extras import execute_values

dotenv.load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

genai.configure(api_key=GEMINI_API_KEY)

# Connect to PostgreSQL
def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# Function to read and chunk text
def chunk_text(content):
    # Split content into chunks based on '###' headings
    chunks = re.split(r"(?<=###)\s*", content)
    final_chunks = []
    for chunk in chunks:
        words = chunk.strip().split()
        while len(words) > 300:
            final_chunks.append(' '.join(words[:300]))
            words = words[300:]
        if words:
            final_chunks.append(' '.join(words))
    return final_chunks


# Function to get embeddings from Gemini model
def get_embeddings_from_gemini(texts):
    embeddings = []
    for text in texts:
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=text
        )
        embedding = response['embedding']
        # Ensure the embedding has the correct dimension
        # embedding = adjust_embedding_dimension(embedding, 1024)
        embeddings.append(embedding)
    return embeddings

# Function to store embeddings in PostgreSQL
def store_embeddings_in_postgres(chatbotID, userId, topic, texts, embeddings):
    # SQL query for bulk insertion
    insert_query = """
    INSERT INTO "embeddings" ("chatbotid", "userId", "topic", "text", "embedding", "createdAt", "updatedAt")
    VALUES %s
    """
    
    # Prepare data for insertion
    records = [
        (chatbotID, userId, topic, text, embedding, time.strftime('%Y-%m-%d %H:%M:%S'), time.strftime('%Y-%m-%d %H:%M:%S'))
        for text, embedding in zip(texts, embeddings)
    ]
    
    # Insert data into PostgreSQL
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            execute_values(cursor, insert_query, records, template=None, page_size=100)
        conn.commit()
    except Exception as e:
        print("Failed to insert embeddings:", e)
        conn.rollback()
    finally:
        conn.close()

# Main function to generate and store embeddings
def embed(content, chatbotID, userId, topic):
    print("Embedding content...")
    
    # Chunk text into sections
    print(content)
    chunks = chunk_text(content)
    
    # Generate embeddings using Gemini
    embeddings = get_embeddings_from_gemini(chunks)
    
    # Store embeddings in PostgreSQL
    print("Storing embeddings in PostgreSQL...")
    store_embeddings_in_postgres(chatbotID, userId, topic, chunks, embeddings)
    print("Content embedded and stored successfully.")
