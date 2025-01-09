from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
import re
import time
import os
import google.generativeai as genai
# Initialize Pinecone client
pc = Pinecone(api_key="pcsk_3ijyps_JwD95UHEhuhMz1pLtyxbqw6pBmq563pb9hgQj5f56rVa17vCCMaKfJ3pyP9r5D6")
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create a serverless index
index_name = "gemini-index"

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

# Wait for the index to be ready
while not pc.describe_index(index_name).status['ready']:
    time.sleep(1)

# Connect to the index
index = pc.Index(index_name)

# Function to read and chunk text
def chunk_text(file_path):
    with open(file_path, "r") as file:
        content = file.read()

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


# Process the file
file_path = "one.txt"
chunks = chunk_text(file_path)

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

# Upsert vectors into Pinecone
index.upsert(
    vectors=records,
    namespace="gemini-namespace"
)

print(f"Uploaded {len(chunks)} chunks to Pinecone.")

# Query Pinecone with a search example
query = "Tell me about the tech company known as Apple."
query_embedding = get_embeddings_from_gemini([query])[0]  # Generate query embedding using Gemini

# Search the index
results = index.query(
    namespace="gemini-namespace",
    vector=query_embedding,
    top_k=3,
    include_values=False,
    include_metadata=True
)

print("Search Results:", results)
