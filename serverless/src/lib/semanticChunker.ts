import { GoogleGenerativeAI } from '@google/generative-ai';
import natural from 'natural';
const math = await import('mathjs');
import { quantile } from 'd3-array';
import { config } from '../config/env.js';
import dotenv from 'dotenv';

dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface SentenceObject {
  sentence: string;
  index: number;
  combined_sentence?: string;
  combined_sentence_embedding?: number[];
  distance_to_next?: number;
}

const splitToSentencesUsingNLP = (textCorpus: string): string[] => {
  console.log('Original text length:', textCorpus.length);
  
  const cleanedText = textCorpus
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  console.log('Cleaned text length:', cleanedText.length);
  
  if (!cleanedText) {
    console.warn('No text content after cleaning');
    return [];
  }

  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(cleanedText);
  
  console.log('Number of sentences found:', sentences.length);
  
  return sentences
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
};

const structureSentences = (
  sentences: string[],
  bufferSize: number = 1
): SentenceObject[] => {
  const sentenceObjectArray: SentenceObject[] = sentences.map(
    (sentence, i) => ({
      sentence,
      index: i,
    })
  );

  sentenceObjectArray.forEach((currentSentenceObject, i) => {
    let combinedSentence = "";

    for (let j = i - bufferSize; j < i; j++) {
      if (j >= 0) {
        combinedSentence += sentenceObjectArray[j].sentence + " ";
      }
    }

    combinedSentence += currentSentenceObject.sentence + " ";

    for (let j = i + 1; j <= i + bufferSize; j++) {
      if (j < sentenceObjectArray.length) {
        combinedSentence += sentenceObjectArray[j].sentence;
      }
    }

    sentenceObjectArray[i].combined_sentence = combinedSentence.trim();
  });

  return sentenceObjectArray;
};

const generateAndAttachEmbeddings = async (
  sentencesArray: SentenceObject[]
): Promise<SentenceObject[]> => {

  console.log('Generating embeddings...');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
  const googleai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string).getGenerativeModel({
    model: "text-embedding-004",
  });

  // Deep copy the sentencesArray to ensure purity
  const sentencesArrayCopy: SentenceObject[] = sentencesArray.map(
    (sentenceObject) => ({
      ...sentenceObject,
      combined_sentence_embedding: sentenceObject.combined_sentence_embedding
        ? [...sentenceObject.combined_sentence_embedding]
        : undefined,
    })
  );

  // Generate embeddings for each combined sentence
  for (let i = 0; i < sentencesArrayCopy.length; i++) {
    if (sentencesArrayCopy[i].combined_sentence) {
      const result = await googleai.embedContent(sentencesArrayCopy[i].combined_sentence!);
      sentencesArrayCopy[i].combined_sentence_embedding = result.embedding.values;
    }
  }

  return sentencesArrayCopy;
};

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = math.dot(vecA, vecB) as number;
  const normA = math.norm(vecA) as number;
  const normB = math.norm(vecB) as number;

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
};

const calculateCosineDistancesAndSignificantShifts = (
  sentenceObjectArray: SentenceObject[],
  percentileThreshold: number
): { updatedArray: SentenceObject[]; significantShiftIndices: number[] } => {
  const distances: number[] = [];
  const updatedSentenceObjectArray = sentenceObjectArray.map(
    (item, index, array) => {
      if (
        index < array.length - 1 &&
        item.combined_sentence_embedding &&
        array[index + 1].combined_sentence_embedding
      ) {
        const similarity = cosineSimilarity(
          item.combined_sentence_embedding!,
          array[index + 1].combined_sentence_embedding!
        );
        const distance = 1 - similarity;
        distances.push(distance);
        return { ...item, distance_to_next: distance };
      }
      return { ...item, distance_to_next: undefined };
    }
  );

  const sortedDistances = [...distances].sort((a, b) => a - b);
  const quantileThreshold = percentileThreshold / 100;
  const breakpointDistanceThreshold = quantile(
    sortedDistances,
    quantileThreshold
  );

  if (breakpointDistanceThreshold === undefined) {
    throw new Error("Failed to calculate breakpoint distance threshold");
  }

  const significantShiftIndices = distances
    .map((distance, index) =>
      distance > breakpointDistanceThreshold ? index : -1
    )
    .filter((index) => index !== -1);

  return {
    updatedArray: updatedSentenceObjectArray,
    significantShiftIndices,
  };
};

const groupSentencesIntoChunks = (
  sentenceObjectArray: SentenceObject[],
  shiftIndices: number[]
): string[] => {
  let startIdx = 0;
  const chunks: string[] = [];
  const adjustedBreakpoints = [...shiftIndices, sentenceObjectArray.length - 1];

  adjustedBreakpoints.forEach((breakpoint) => {
    const group = sentenceObjectArray.slice(startIdx, breakpoint + 1);
    const combinedText = group.map((item) => item.sentence).join(" ");
    chunks.push(combinedText);
    startIdx = breakpoint + 1;
  });

  return chunks;
};

export async function semanticChunking(text: string): Promise<string[]> {
  try {
    const sentences = splitToSentencesUsingNLP(text);
    const structuredSentences = structureSentences(sentences, 1);
    const sentencesWithEmbeddings = await generateAndAttachEmbeddings(
      structuredSentences
    );
    const { updatedArray, significantShiftIndices } =
      calculateCosineDistancesAndSignificantShifts(sentencesWithEmbeddings, 90);
    const semanticChunks = groupSentencesIntoChunks(
      updatedArray,
      significantShiftIndices
    );
    return semanticChunks;
  } catch (error) {
    console.error("Error in semantic chunking:", error);
    throw error;
  }
} 