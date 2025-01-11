import { Pool } from "pg";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Replace with your database connection string
});

// async function adjustEmbeddingLength(embedding: number[]) {
//   const length = 1024;
//   if (embedding.length < length) {
//     return embedding.concat(Array(length - embedding.length).fill(0));
//   } else {
//     return embedding.slice(0, length);
//   }
// }

export async function searchDocumentation(
  prompt: string,
  chatbotID: string
): Promise<{ error: string } | { text: any }[]> {
  console.log("searchDocumentation called!");
  console.log("Prompt:", prompt);
  try {
    // Initialize Google AI model
    const googleai = new GoogleGenerativeAI(process.env.API_KEY as string).getGenerativeModel({
      model: "text-embedding-004",
    });

    // Clean up the prompt
    prompt = prompt.replace(/\n/g, " ");

    // Generate the embedding for the prompt
    const result = await googleai.embedContent(prompt);
    const embedding = result.embedding.values;
    console.log("Original embedding size:", embedding.length);


    // Prepare query for cosine similarity search
    const query = `
    SELECT "topic", "text"
    FROM "embeddings"
    WHERE "chatbotid" = $1
    ORDER BY "embedding" <=> $2
    LIMIT 1;
  `;
  const formattedEmbedding = JSON.stringify(embedding).replace(/,/g, ", ");
    const client = await pool.connect();
    try {
      const res = await client.query(query, [chatbotID, formattedEmbedding]);
      if (res.rows.length === 0) {
        return { error: "No matching documentation found." };
      }

      const results = res.rows.map((row) => ({ text: row.text }));
      return results;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: "An unexpected error occurred." };
  }
}
