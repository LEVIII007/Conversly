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
    topic: string;    // This should match the corresponding DataSource name
    text: string;
    embedding: number[];
  }>,
  sources: Array<{
    chatbotId: number;
    type: 'Website' | 'QandA' | 'Document' | 'CSV';
    name: string;
    sourceDetails: any;
    citation: string;  // New field to store citation directly
  }>
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Bulk insert data sources with the new citation column.
    const sourceValues: any[] = [];
    const sourceValueClauses = sources.map((item, index) => {
      const baseIndex = index * 5;
      sourceValues.push(
        item.chatbotId,
        item.type,
        item.name,
        JSON.stringify(item.sourceDetails),
        item.citation
      );
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
    }).join(',');

    const sourcesQueryText = `
      INSERT INTO "DataSource" ("chatbotId", type, name, "sourceDetails", citation)
      VALUES ${sourceValueClauses}
      RETURNING id, name, citation
    `;

    const sourceResult = await client.query(sourcesQueryText, sourceValues);

    // Build a mapping from data source name to its inserted id and citation
    const sourceMapping: { [name: string]: { id: number; citation: string } } = {};
    for (const row of sourceResult.rows) {
      sourceMapping[row.name] = { id: row.id, citation: row.citation };
    }

    // Step 2: Bulk insert embeddings, setting dataSourceId and citation from the mapping.
    const embeddingValues: any[] = [];
    const embeddingValueClauses = embeddings.map((item, index) => {
      const baseIndex = index * 7;
      // Lookup the corresponding DataSource ID using item.topic (which should match the DataSource name)
      const mapping = sourceMapping[item.topic];
      const dataSourceId = mapping ? mapping.id : null;
      // For citation, you may choose to use the DataSource's citation.
      const citationValue = mapping ? mapping.citation : item.topic;
      embeddingValues.push(
        item.userId,
        item.chatbotId,
        item.topic,
        item.text,
        JSON.stringify(item.embedding),
        dataSourceId,
        citationValue
      );
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7})`;
    }).join(',');

    const embeddingsQueryText = `
      INSERT INTO embeddings ("userId", "chatbotid", topic, text, embedding, "dataSourceId", citation)
      VALUES ${embeddingValueClauses}
    `;

    await client.query(embeddingsQueryText, embeddingValues);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in bulk save transaction:', error);
    throw error;
  } finally {
    client.release();
  }
}


interface SearchResult {
  text: string;
  citation : string;
}

export async function searchDocumentation(
  prompt: string,
  chatbotId: number,
  limit: number = 3
): Promise<{ citation: string; text: string }[]> {
  try {
    // Get embedding for the search query
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(prompt);
    const queryEmbedding = result.embedding.values;

    const queryText = `
      SELECT text, citation
      FROM embeddings 
      WHERE chatbotid = $1
      ORDER BY embedding <=> '[${queryEmbedding}]'
      LIMIT $2;
    `;

    const response = await query(queryText, [chatbotId, limit]);
    const results = response.rows as SearchResult[];

    if (results.length === 0) {
      return [];
    }
    // const citations = results.map(row => row.citation);
    // await updateAnalytics(chatbotId, citations);

    // Return the results as an array of objects containing citation and text
    return results.map(row => ({
      citation: row.citation,
      text: row.text
    }));

  } catch (error) {
    console.error('Error in searchDocumentation:', error);
    throw error;
  }
}


export const updateAnalytics = async (chatbotId: number, citations: string[]) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // This query:
    // 1. Updates the analytics row for the given chatbot (incrementing responses) and returns its id.
    // 2. Inserts multiple citation rows by unnesting the citations array.
    // 3. On conflict (i.e. if a citation for that chatbot already exists) it increments the count.
    const queryText = `
      WITH updated AS (
        UPDATE analytics
        SET responses = responses + 1, updatedat = NOW()
        WHERE chatbotid = $1
        RETURNING id
      )
      INSERT INTO Citation (analyticsId, chatbotId, source, count, createdAt, updatedAt)
      SELECT updated.id, $1, c, 1, NOW(), NOW()
      FROM updated, unnest($2::text[]) AS c
      ON CONFLICT (chatbotId, source)
      DO UPDATE SET count = Citation.count + 1, updatedAt = NOW();
    `;

    await client.query(queryText, [chatbotId, citations]);

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