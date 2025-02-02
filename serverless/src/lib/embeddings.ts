import { GoogleGenerativeAI } from '@google/generative-ai';
// import { config } from '../config/env.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Generating embeddings...');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
const googleai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string).getGenerativeModel({
  model: "text-embedding-004",
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await googleai.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Batch process multiple texts for embeddings
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings = await Promise.all(
      texts.map(text => generateEmbedding(text))
    );
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings batch:', error);
    throw error;
  }
} 

export async function improveChunks(chunks: string[]): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const improvedChunks: string[] = [];
    for (let i = 0; i < chunks.length; i += 5) {
      const chunkBatch = chunks.slice(i, i + 5);
      const batchResults = await Promise.all(
        chunkBatch.map(async (chunk) => {
          const prompt: string = 
            `The given text is to be stored as chunks along with it's embeddings for RAG application. Improve the following text to a markdown format with headings and points. Do not lose any meaning from it:\n\n${chunk}`;
          const result = await model.generateContent(prompt);
          return result.response.text();
        })
      );
      improvedChunks.push(...batchResults);
    }
    return improvedChunks;
  } catch (error) {
    console.error('Error improving chunks:', error);
    throw error;
  }
}