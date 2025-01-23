export interface ProcessRequestBody {
  userId: string;
  chatbotID: string;
  websiteURL?: string[];
  documents?: File[];
  qandaData?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface DataSource {
  type: 'Website' | 'Document' | 'QandA';
  name: string;
  sourceDetails: any;
}

export interface DocumentChunk {
  text: string;
  metadata?: {
    source: string;
    type: string;
  };
} 