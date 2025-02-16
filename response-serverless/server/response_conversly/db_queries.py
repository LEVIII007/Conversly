from typing import List
import os
import asyncpg
import httpx

from dotenv import load_dotenv
import logging

load_dotenv()


env_path = os.path.join(os.path.dirname(__file__), "..", ".env")

if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):  # Skip empty lines and comments
                continue
            if "=" in line:
                key, value = line.split("=", 1)
                os.environ[key] = value



# print("gemini api key")
# print(os.getenv("GEMINI_API_KEY"))

logger = logging.getLogger(__name__)

print("database url")
print(os.getenv("DATABASE_URL"))

# Database connection management
class DatabasePool:
    _instance = None
    _pool = None

    @classmethod
    async def get_pool(cls):
        if not cls._pool:
            try:
                cls._pool = await asyncpg.create_pool(
                    dsn=os.getenv("DATABASE_URL"),
                    min_size=5,
                    max_size=20
                )
                logger.info("Database pool created")
                print("Database pool created")
            except Exception as e:
                logger.error(f"Failed to create database pool: {e}")
                raise
        return cls._pool

    @classmethod
    async def close_pool(cls):
        if cls._pool:
            await cls._pool.close()
            cls._pool = None
            logger.info("Database pool closed")

# schema : 
# model ChatBot {
#   id            Int          @id @default(autoincrement())
#   userId        String       @db.VarChar
#   name          String       @db.VarChar
#   description   String
#   System_Prompt String
#   createdAt     DateTime?    @default(now()) @db.Timestamptz(6)
#   updatedAt     DateTime?    @default(now()) @db.Timestamptz(6)
#   api_key       String?      @db.VarChar(255)
#   DataSource    DataSource[]
#   Analytics     analytics?
#   embeddings    embeddings[]
# }

# model embeddings {
#   id           Int                   @id @default(autoincrement())
#   userId       String                @db.VarChar
#   chatbotid    Int
#   topic        String                @db.VarChar
#   text         String                @db.VarChar
#   embedding    Unsupported("vector")
#   createdAt    DateTime?             @default(now()) @db.Timestamptz(6)
#   updatedAt    DateTime?             @default(now()) @db.Timestamptz(6)
#   dataSourceId Int?
#   citation     String?
#   ChatBot      ChatBot               @relation(fields: [chatbotid], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_chatbotid")
#   DataSource   DataSource?           @relation(fields: [dataSourceId], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_datasourceid")

#   @@index([embedding], map: "embedding_idx")
#   @@index([citation], map: "idx_embeddings_citation")
# }

# model DataSource {
#   id            Int          @id @default(autoincrement())
#   chatbotId     Int
#   type          String
#   sourceDetails Json         @db.Json
#   createdAt     DateTime?    @default(now()) @db.Timestamptz(6)
#   updatedAt     DateTime?    @default(now()) @db.Timestamptz(6)
#   name          String       @db.VarChar
#   citation      String?
#   ChatBot       ChatBot      @relation(fields: [chatbotId], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_chatbot")
#   embeddings    embeddings[]

#   @@index([citation], map: "idx_datasource_citation")
# }

# // type in datadource can be 'Website', 'Document', 'QandA', 'Notion', 'WordPress', 'CodeFile', 'GitHub', 'Other')
# model analytics {
#   id        Int        @id @default(autoincrement())
#   chatbotid Int        @unique(map: "unique_chatbotid")
#   responses Int?       @default(0)
#   likes     Int?       @default(0)
#   dislikes  Int?       @default(0)
#   createdat DateTime?  @default(now()) @db.Timestamptz(6)
#   updatedat DateTime?  @default(now()) @db.Timestamptz(6)
#   ChatBot   ChatBot    @relation(fields: [chatbotid], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_chatbot")
#   citation  citation[]
# }


# model citation {
#   id          Int       @id @default(autoincrement())
#   analyticsid Int
#   chatbotid   Int
#   source      String
#   count       Int?      @default(1)
#   createdat   DateTime? @default(now()) @db.Timestamp(6)
#   updatedat   DateTime? @default(now()) @db.Timestamp(6)
#   analytics   analytics @relation(fields: [analyticsid], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_analytics")

#   @@unique([chatbotid, source])
# }

#get the text from embeddings for a particular chatbot
#returns the text + citation in string format. 


# Load API Key from environment variables
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

# Google Gemini Embedding API Endpoint
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={GOOGLE_API_KEY}"

async def get_embedding(text: str) -> List[float]:
    """Fetch embedding vector from Google's Gemini API asynchronously."""
    payload = {
        "model": "models/text-embedding-004",
        "content": {
            "parts": [{"text": text}]
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(API_URL, json=payload, headers={"Content-Type": "application/json"})

        response.raise_for_status()  # Raises exception for HTTP errors
        data = response.json()

        # Extract embedding values
        return data["embedding"]

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error {e.response.status_code}: {e.response.text}")
    except Exception as e:
        logger.error(f"Error getting embedding: {e}")

    return [0] * 768  # Return zero vector on error


async def search_documentation(query: str, chatbotId: str) -> str:
    try:
        query_embedding = await get_embedding(query)
        pool = await DatabasePool.get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT text, citation
                FROM embeddings 
                WHERE chatbotid = $1
                ORDER BY embedding <=> $2::vector
                LIMIT 2;
            """, int(chatbotId), f'[{",".join(str(x) for x in query_embedding)}]')

        print(rows)
        return "\n\n---\n\n".join(
            f"Source: {row['citation'] or 'Uncategorized'}\n{row['text']}"
            for row in rows
        ) if rows else "No relevant documentation found."
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        return f"Error retrieving documentation: {str(e)}"


# list the unique citations from datasource table for a particular chatbot
async def list_documentation_pages(chatbotId: str) -> List[str]:
    try:
        pool = await DatabasePool.get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """SELECT DISTINCT citation FROM "DataSource" WHERE "chatbotId" = $1::integer""",
                int(chatbotId)
            )
        return [row['citation'] for row in rows] if rows else []
    except Exception as e:
        logger.error(f"Listing error: {e}")
        return []


# // search the embedding table for text using citations(url) for a particular chatbot
async def get_page_content(url: str, chatbotId: str) -> str:
    try:
        pool = await DatabasePool.get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT text, citation
                FROM embeddings
                WHERE citation = $1 AND chatbotid = $2::integer
                ORDER BY createdat
            """, url, int(chatbotId))
        if not rows:
            return f"No content found for: {url}"
            
        return "\n\n".join(
            f"## Source: {row['citation']}\n{row['text']}"
            for row in rows
        )
    except Exception as e:
        logger.error(f"Content error: {e}")
        return f"Error retrieving content: {str(e)}"

async def update_analytics(chatbot_id: str, citations: List[str]):
    try:
        pool = await DatabasePool.get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                await conn.execute("""
                    WITH updated AS (
                        UPDATE analytics
                        SET responses = responses + 1, updatedat = NOW()
                        WHERE chatbotid = $1::integer
                        RETURNING id
                    )
                    INSERT INTO Citation (analyticsId, chatbotId, source, count, createdAt, updatedAt)
                    SELECT updated.id, $1::integer, unnest($2::text[]), 1, NOW(), NOW()
                    FROM updated
                    ON CONFLICT (chatbotId, source)
                    DO UPDATE SET count = Citation.count + 1, updatedAt = NOW();
                """, int(chatbot_id), citations)
    except Exception as e:
        logger.error(f"Analytics error: {e}")
