import google.generativeai as genai
import os
import psycopg2
from pgvector.psycopg2 import register_vector

# Google Gemini API configuration
genai.configure(api_key=os.environ["GEMINI_API_KEY"])



# Connect to the PostgreSQL database
conn = psycopg2.connect(os.environ["DATABASE_URL"])
register_vector(conn)  # Register the vector type
cur = conn.cursor()

# Load the text file
with open("one.txt", "r") as file:
    content = file.read()

# Split content into chunks based on headings
chunks = content.split("###")[1:]  # Split and remove the first empty chunk
chunks = [chunk.strip() for chunk in chunks if chunk.strip()]  # Remove empty chunks

# Process each chunk
for chunk in chunks:
    # Generate the embedding using Google Gemini
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=chunk
    )
    embedding = result['embedding']
    
    # Insert text and embedding into the database
    cur.execute(
        "INSERT INTO embeddings (text, embedding) VALUES (%s, %s)",
        (chunk, embedding)
    )

# Commit changes and close the connection
conn.commit()
cur.close()
conn.close()

print("Embeddings stored successfully!")
