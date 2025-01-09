import google.generativeai as genai
import os
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
import re
import time
import dotenv


dotenv.load_dotenv()

PINECONE_URL = os.getenv("PINECONE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print(PINECONE_URL)
print(GEMINI_API_KEY)

pc = Pinecone(api_key=PINECONE_URL)
genai.configure(api_key=GEMINI_API_KEY)

def ensure_index(index_name):
    if not pc.has_index(index_name):
        pc.create_index(
            name=index_name,
            dimension=1024,  # Ensure this matches the embedding model output dimension
            metric="cosine",
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )
    while not pc.describe_index(index_name).status['ready']:
        time.sleep(1)
    return pc.Index(index_name)

# Function to read and chunk text
def chunk_text(content):
    # Split content into chunks based on '###' headings
    chunks = re.split(r"(?<=###)\s*", content)
    return [chunk.strip() for chunk in chunks if chunk.strip()]

# Function to get embeddings from Gemini model

def adjust_embedding_dimension(embedding, target_dimension):
    # Adjust the embedding to match the target dimension
    if len(embedding) < target_dimension:
        # Pad the embedding with zeros if it's too short
        embedding.extend([0] * (target_dimension - len(embedding)))
    elif len(embedding) > target_dimension:
        # Truncate the embedding if it's too long
        embedding = embedding[:target_dimension]
    return embedding

def get_embeddings_from_gemini(texts):
    embeddings = []
    for text in texts:
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=text
        )
        embedding = response['embedding']
        
        # Ensure the embedding has the correct dimension
        if len(embedding) != 1024:
            # Adjust the embedding to match the dimension of the index
            embedding = adjust_embedding_dimension(embedding, 1024)
        
        embeddings.append(embedding)  # Update based on the structure of the Gemini response
    return embeddings

def embed(content, chatbotID):
    chunks = chunk_text(content)
    # Generate embeddings using Gemini
    embeddings = get_embeddings_from_gemini(chunks)

    # Prepare data for Pinecone
    records = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        records.append({
            "id": f"chunk-{i+1}",
            "values": embedding,
            "metadata": {"text": chunk}
        })
    
    index = ensure_index(chatbotID)

    # Upsert vectors into Pinecone
    index.upsert(
        vectors=records,
        namespace="gemini-namespace"
    )

# # Example usage of the embed function
# if __name__ == "__main__":
#     content = """
#     ### Introduction
#     This is the introduction section of the document.
    
#     ### Chapter 1
#     This is the first chapter of the document.
    
#     ### Conclusion
#     This is the conclusion section of the document.
#     """
#     chatbotID = "example-chatbot"
#     embed(content, chatbotID)




