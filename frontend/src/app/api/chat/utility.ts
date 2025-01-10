import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });


async function adjustEmbeddingLength(embedding: any) {
    const length = 1024;
    if (embedding.length < length) {
        return embedding.concat(Array(length - embedding.length).fill(0));
    } else {
        return embedding.slice(0, length);
    }
}

export async function searchDocumentation(prompt: string,  chatbotID : string): Promise<{ error: string } | { text: any }[]> {
    console.log("searchDocumentation called!");
    try {
        // Initialize Google AI model
        const googleai = new GoogleGenerativeAI(process.env.API_KEY as string).getGenerativeModel({ model: "text-embedding-004" });

        // Clean up the prompt
        prompt = prompt.replace(/\n/g, " ");

        // Generate the embedding for the prompt
        const result = await googleai.embedContent(prompt);
        const embedding = result.embedding;


        const embeddingArray = embedding.values;
        console.log("Embedding array size:", embeddingArray.length);
        const newembeddings = await adjustEmbeddingLength(embeddingArray);
        console.log("New embedding array size:", newembeddings.length);
        const index = pc.index(chatbotID);
        const queryResponse = await index.namespace(chatbotID).query({
            topK: 1,
            vector: newembeddings,
            includeValues: false,
            includeMetadata: true
          });

        //   console.log("Query response:", queryResponse);
            const results = queryResponse.matches.map((result: any) => {
                console.log("Result metadata:", result.metadata.text);
                return result.metadata.text;
            });

            return results.map((text: any) => ({ text }));
    } catch (error) {
        console.error("An error occurred:", error);
        return { error: "An unexpected error occurred." };
    }
}
