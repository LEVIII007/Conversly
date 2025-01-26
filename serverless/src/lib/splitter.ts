import { semanticChunking } from './semanticChunker.js';

export interface DocumentChunk {
  text: string;
  metadata?: { source: string; type: string };
}



export async function splitDocument(
  content: string,
  contentType: string,
  metadata?: { source: string; type: string }
): Promise<DocumentChunk[]> {
  try {
    // For semantic chunking (if needed)
    if (contentType === 'semantic') {
      const chunks = await semanticChunking(content);
      return chunks.map(chunk => ({
        text: chunk,
        metadata
      }));
    }

    // Default recursive splitter
    const chunks = recursiveSplit(content, {
      chunkSize: 1000, // Desired chunk size in characters
      chunkOverlap: 200, // Overlap between chunks in characters
      separators: ["\n\n", "\n", " ", ""] // Splitting hierarchy
    });

    return chunks.map(chunk => ({
      text: chunk,
      metadata
    }));
  } catch (error) {
    console.error('Error splitting document:', error);
    throw error;
  }
}

// Custom recursive splitter function
function recursiveSplit(
  text: string,
  options: { chunkSize: number; chunkOverlap: number; separators: string[] }
): string[] {
  const { chunkSize, chunkOverlap, separators } = options;

  // Base case: if the text is already smaller than the chunk size, return it as a single chunk
  if (text.length <= chunkSize) {
    return [text];
  }

  // Try splitting the text using the provided separators in order of priority
  for (const separator of separators) {
    const parts = text.split(separator);

    // If splitting results in parts that are too large, continue to the next separator
    if (parts.some(part => part.length > chunkSize)) {
      continue;
    }

    // Combine parts into chunks with overlap
    const chunks: string[] = [];
    let currentChunk = '';
    let overlapBuffer = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // If adding the current part exceeds the chunk size, finalize the current chunk
      if (currentChunk.length + part.length > chunkSize) {
        chunks.push(currentChunk);
        currentChunk = overlapBuffer + part; // Start new chunk with overlap
        overlapBuffer = '';
      } else {
        currentChunk += (currentChunk ? separator : '') + part;
      }

      // Update the overlap buffer
      if (currentChunk.length > chunkOverlap) {
        overlapBuffer = currentChunk.slice(-chunkOverlap);
      }
    }

    // Add the last chunk if it's not empty
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  // If no separator works, split the text into fixed-size chunks
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start = end - chunkOverlap; // Apply overlap
  }

  return chunks;
}


export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'txt':
      return 'text/plain';
    case 'md':
      return 'text/markdown';
    case 'json':
      return 'application/json';
    default:
      return 'text/plain';
  }
} 