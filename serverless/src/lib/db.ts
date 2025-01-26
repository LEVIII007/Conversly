// import { Pool } from 'pg';
import pkg from 'pg';
import { config } from '../config/env.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const { Pool } = pkg;
// Initialize the connection pool
const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

// Helper function to run queries
export async function query(text: string, params?: any[]) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}

// export async function bulkSaveEmbeddings(
//   embeddings: Array<{
//     userId: number,
//     chatbotId: number,
//     topic: string,
//     text: string,
//     embedding: number[]
//   }>
// ) {
//   const client = await pool.connect();

//   try {
//     await client.query('BEGIN');

//     // Construct parameterized query
//     const values: any[] = [];
//     const valueClauses = embeddings.map((item, index) => {
//       const baseIndex = index * 5;
//       values.push(
//         item.userId,
//         item.chatbotId,
//         item.topic,
//         item.text,
//         JSON.stringify(item.embedding) // Convert the array to a JSON string
//       );
//       return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
//     });

//     const queryText = `
//       INSERT INTO embeddings ("userId", "chatbotid", "topic", "text", "embedding")
//       VALUES ${valueClauses.join(',')}
//     `;

//     // Execute the query with parameters
//     await client.query(queryText, values);
//     await client.query('COMMIT');
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error bulk saving embeddings:', error);
//     throw error;
//   } finally {
//     client.release();
//   }
// }

// // Bulk save data sources to database
// export async function bulkSaveDataSources(
//   sources: Array<{
//     chatbotId: number,
//     type: 'Website' | 'Document' | 'QandA' | 'CSV',
//     name: string,
//     sourceDetails: any
//   }>
// ) {
//   const client = await pool.connect();
  
//   try {
//     await client.query('BEGIN');

//     // Create values string for bulk insert
//     const values = sources.map((item, index) => 
//       `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`
//     ).join(',');

//     // Flatten parameters array
//     const params = sources.flatMap(item => [
//       item.chatbotId,
//       item.type,
//       item.name,
//       item.sourceDetails
//     ]);

//     const queryText = `
//       INSERT INTO "DataSource" ("chatbotId", type, name, "sourceDetails")
//       VALUES ${values}
//     `;
    
//     await client.query(queryText, params);
//     await client.query('COMMIT');

//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error bulk saving data sources:', error);
//     throw error;
//   } finally {
//     client.release();
//   }
// }

export async function bulkSaveEmbeddingsAndDataSources(
  embeddings: Array<{
    userId: number;
    chatbotId: number;
    topic: string;
    text: string;
    embedding: number[];
  }>,
  sources: Array<{
    chatbotId: number;
    type: 'Website' | 'Document' | 'QandA' | 'CSV';
    name: string;
    sourceDetails: any;
  }>
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Bulk save embeddings
    const embeddingValues: any[] = [];
    const embeddingValueClauses = embeddings.map((item, index) => {
      const baseIndex = index * 5;
      embeddingValues.push(
        item.userId,
        item.chatbotId,
        item.topic,
        item.text,
        JSON.stringify(item.embedding) // Convert the array to a JSON string
      );
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
    });

    const embeddingsQueryText = `
      INSERT INTO embeddings ("userId", "chatbotid", "topic", "text", "embedding")
      VALUES ${embeddingValueClauses.join(',')}
    `;

    await client.query(embeddingsQueryText, embeddingValues);

    // Step 2: Bulk save data sources
    const sourceValues = sources.map((item, index) => 
      `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`
    ).join(',');

    const sourceParams = sources.flatMap(item => [
      item.chatbotId,
      item.type,
      item.name,
      item.sourceDetails
    ]);

    const sourcesQueryText = `
      INSERT INTO "DataSource" ("chatbotId", type, name, "sourceDetails")
      VALUES ${sourceValues}
    `;

    await client.query(sourcesQueryText, sourceParams);

    // Commit the transaction
    await client.query('COMMIT');
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    console.error('Error in bulk save transaction:', error);
    throw error;
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

interface SearchResult {
  topic: string;
  text: string;
}

export async function searchDocumentation(
  prompt: string,
  chatbotId: number,
  limit: number = 3
): Promise<string> {
  try {
    // Get embedding for the search query
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    // const googleai = new GoogleGenerativeAI(process.env.API_KEY as string).getGenerativeModel({
    //   model: "text-embedding-004",
    // });
    const result = await model.embedContent(prompt);
    const queryEmbedding = result.embedding.values;

    console.log(prompt)
    console.log(queryEmbedding)

    const queryText = `
      SELECT topic, text
      FROM embeddings 
      WHERE chatbotid = $1
      ORDER BY embedding <=> '[${queryEmbedding}]'
      LIMIT $2;
    `;

    const response = await query(queryText, [chatbotId, limit]);
    const results = response.rows as SearchResult[];

    if (results.length === 0) {
      return "No matching documentation found.";
    }

    // Extract topics from the results
    const topics = results.map(row => row.topic);

    // Update analytics with the found topics
    await updateAnalytics(chatbotId, topics);

    // Format the context string
    let contextString = "\n\nRelevant Context:\n";
    results.forEach((row, idx) => {
      const topic = String(row.topic);
      const text = String(row.text);
      contextString += `\nSection ${idx + 1} (from ${topic}):\n${text}\n`;
    });

    return contextString;

  } catch (error) {
    console.error('Error in searchDocumentation:', error);
    throw error;
  }
} 


export const updateAnalytics = async (chatbotId: number, topics: string[]) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Fetch the current citations for the given chatbotId
    const { rows } = await client.query(
      `SELECT citations FROM analytics WHERE chatbotid = $1 FOR UPDATE`,
      [chatbotId]
    );

    // Parse the current citations (if any) or initialize as an empty object
    let currentCitations = rows.length > 0 && rows[0].citations ? rows[0].citations : {};
    if (typeof currentCitations === 'string') {
      currentCitations = JSON.parse(currentCitations); // Handle stringified JSON (PostgreSQL might return this)
    }

    // Update citations with new topics
    topics.forEach((topic) => {
      if (currentCitations[topic]) {
        currentCitations[topic] += 1; // Increment count if the topic exists
      } else {
        currentCitations[topic] = 1; // Add the topic with count = 1
      }
    });

    // Update the `citations` column and increment `responses`
    await client.query(
      `
      INSERT INTO analytics (chatbotid, citations)
      VALUES ($1, $2, 1)
      ON CONFLICT (chatbotid) 
      DO UPDATE 
      SET 
        citations = $2::jsonb,
      `,
      [chatbotId, JSON.stringify(currentCitations)]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating analytics:', error);
    throw error;
  } finally {
    client.release();
  }
};




export async function updatelikeDislike(chatbotId: number, like: boolean) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update likes or dislikes in one query
    await client.query(
      `
      INSERT INTO analytics (chatbotid, likes, dislikes)
      VALUES ($1, $2, $3)
      ON CONFLICT (chatbotid)
      DO UPDATE SET 
        likes = analytics.likes + EXCLUDED.likes,
        dislikes = analytics.dislikes + EXCLUDED.dislikes
      `,
      [chatbotId, like ? 1 : 0, like ? 0 : 1]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating likes/dislikes:', error);
    throw error;
  } finally {
    client.release();
  }
}


export async function updateResponse(chatbotId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

  await client.query(
    `
    UPDATE analytics
    SET responses = responses + 1
    WHERE chatbotid = $1
    `,
    [chatbotId]
  );
  await client.query('COMMIT');
    } catch (error) {
  await client.query('ROLLBACK');
  console.error('Error updating response count:', error);
  throw error;
    } finally {
  client.release();
    }
  }