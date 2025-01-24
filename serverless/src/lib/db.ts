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

export async function bulkSaveEmbeddings(
  embeddings: Array<{
    userId: number,
    chatbotId: number,
    topic: string,
    text: string,
    embedding: number[]
  }>
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Construct parameterized query
    const values: any[] = [];
    const valueClauses = embeddings.map((item, index) => {
      const baseIndex = index * 5;
      values.push(
        item.userId,
        item.chatbotId,
        item.topic,
        item.text,
        JSON.stringify(item.embedding) // Convert the array to a JSON string
      );
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
    });

    const queryText = `
      INSERT INTO embeddings ("userId", "chatbotid", "topic", "text", "embedding")
      VALUES ${valueClauses.join(',')}
    `;

    // Execute the query with parameters
    await client.query(queryText, values);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error bulk saving embeddings:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Bulk save data sources to database
export async function bulkSaveDataSources(
  sources: Array<{
    chatbotId: number,
    type: 'Website' | 'Document' | 'QandA',
    name: string,
    sourceDetails: any
  }>
) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create values string for bulk insert
    const values = sources.map((item, index) => 
      `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`
    ).join(',');

    // Flatten parameters array
    const params = sources.flatMap(item => [
      item.chatbotId,
      item.type,
      item.name,
      item.sourceDetails
    ]);

    const queryText = `
      INSERT INTO "DataSource" (chatbotId, type, name, sourceDetails)
      VALUES ${values}
    `;
    
    await client.query(queryText, params);
    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error bulk saving data sources:', error);
    throw error;
  } finally {
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
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(prompt);
    const queryEmbedding = result.embedding.values;

    // Query to find similar content using vector similarity
    const queryText = `
      SELECT topic, text
      FROM embeddings 
      WHERE chatbotid = $1
      ORDER BY embedding <=> '[${queryEmbedding}]'
      LIMIT $3;
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

    // Construct parameterized query for citations
    const values = topics.map((topic, index) => `($1, $${index + 2}, 1)`).join(','); // Add `1` for initial count
    const queryText = `
      INSERT INTO analytics (chatbotid, topic, count, responses)
      VALUES ${values}
      ON CONFLICT (chatbotid, topic) 
      DO UPDATE 
      SET 
        count = analytics.count + EXCLUDED.count, 
        responses = analytics.responses + 1;
    `;

    // Execute the query with parameters
    await client.query(queryText, [chatbotId, ...topics]);

    // Increment the overall responses count (optional if needed globally, not per topic)
    await client.query(
      `UPDATE analytics 
       SET responses = responses + 1 
       WHERE chatbotid = $1`,
      [chatbotId]
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
