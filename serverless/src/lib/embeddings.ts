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