// import { GoogleGenerativeAI } from '@google/generative-ai';
// // import { config } from '../config/env.js';
// import dotenv from 'dotenv';

// dotenv.config();

// console.log('Generating embeddings...');
// console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
// const googleai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string).getGenerativeModel({
//   model: "text-embedding-004",
// });

// export async function generateEmbedding(text: string): Promise<number[]> {
//   try {
//     const result = await googleai.embedContent(text);
//     const embedding = result.embedding;
//     return embedding.values;
//   } catch (error) {
//     console.error('Error generating embedding:', error);
//     throw error;
//   }
// }

// // Batch process multiple texts for embeddings
// export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
//   try {
//     const embeddings = await Promise.all(
//       texts.map(text => generateEmbedding(text))
//     );
//     return embeddings;
//   } catch (error) {
//     console.error('Error generating embeddings batch:', error);
//     throw error;
//   }
// } 

// export async function improveChunks(chunks: string[]): Promise<string[]> {
//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const improvedChunks: string[] = [];
//     for (let i = 0; i < chunks.length; i += 5) {
//       const chunkBatch = chunks.slice(i, i + 5);
//       const batchResults = await Promise.all(
//         chunkBatch.map(async (chunk) => {
//           const prompt: string = 
//             `The given text is to be stored as chunks along with it's embeddings for RAG application. Improve the following text to a markdown format with headings and points. Do not lose any meaning from it:\n\n${chunk}`;
//           const result = await model.generateContent(prompt);
//           return result.response.text();
//         })
//       );
//       improvedChunks.push(...batchResults);
//     }
//     return improvedChunks;
//   } catch (error) {
//     console.error('Error improving chunks:', error);
//     throw error;
//   }
// }

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import pLimit from 'p-limit';

dotenv.config();

// Create a singleton instance for the embedding model
const googleai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const embeddingModel = googleai.getGenerativeModel({ model: "text-embedding-004" });

// Concurrency limiter (adjust limit as appropriate)
const limit = pLimit(5); // allow up to 5 concurrent API calls

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    // Use concurrency limiter
    const embeddings = await Promise.all(texts.map(text => limit(() => generateEmbedding(text))));
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings batch:', error);
    throw error;
  }
}

// For chunk improvement, reuse the generative model instance
export async function improveChunks(chunks: string[]): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const improvedChunks: string[] = [];
    // Limit concurrency for chunk improvement
    for (let i = 0; i < chunks.length; i += 5) {
      const chunkBatch = chunks.slice(i, i + 5);
      const batchResults = await Promise.all(
        chunkBatch.map(chunk =>
          limit(async () => {
            const prompt = `Improve the following text to markdown format with headings and bullet points without losing meaning:\n\n${chunk}`;
            const result = await model.generateContent(prompt);
            return result.response.text();
          })
        )
      );
      improvedChunks.push(...batchResults);
    }
    return improvedChunks;
  } catch (error) {
    console.error('Error improving chunks:', error);
    throw error;
  }
}
