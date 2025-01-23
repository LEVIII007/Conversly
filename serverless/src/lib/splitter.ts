import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { DocumentChunk } from './types.js';
import { semanticChunking } from './semanticChunker.js';

export async function splitDocument(
  content: string,
  contentType: string,
  metadata?: { source: string; type: string }
): Promise<DocumentChunk[]> {
  try {
    // For semantic chunking
    if (contentType === 'semantic') {
      const chunks = await semanticChunking(content);
      return chunks.map(chunk => ({
        text: chunk,
        metadata
      }));
    }

    // Default recursive splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", " ", ""]
    });

    const chunks = await splitter.createDocuments(
      [content],
      [metadata]
    );

    return chunks.map(chunk => ({
      text: chunk.pageContent,
      metadata: {
        source: chunk.metadata.source,
        type: chunk.metadata.type
      }
    }));
  } catch (error) {
    console.error('Error splitting document:', error);
    throw error;
  }
}

// Helper function to determine content type
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