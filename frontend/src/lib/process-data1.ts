'use server';

import { prisma } from '../../prisma';
import { auth } from '../../auth';

interface Document {
  type: 'pdf' | 'txt' | 'xml' | 'csv' | 'json' | 'mdx';
  content: File;
}

interface QandA {
  question: string;
  answer: string;
}

interface ChatBot {
  name: string;
  description: string;
  System_Prompt: string;
  website_URL?: string[]; // Optional
  documents?: Document[]; // Optional
  QandA?: QandA[]; // Optional
  otherSources?: { type: string; name: string }[]; // Optional
}

const SERVER_URL = 'http://localhost:8000';

export async function createChatBot({
  name,
  description,
  System_Prompt,
  website_URL = [],
  documents = [],
  QandA = [],
  otherSources = [],
}: ChatBot) {
  const session = await auth();

  try {
    // Ensure the user is authenticated
    if (!session || !session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // Step 1: Create the chatbot in the database
    const chatbot = await prisma.chatBot.create({
      data: {
        name,
        description,
        System_Prompt,
        userId: session.user.id,
      },
    });

    // Step 2: Create data sources based on inputs
    const dataSources = [];

    // Handle website URLs
    if (website_URL.length > 0) {
      dataSources.push(
        ...website_URL.map((url) => ({
          chatbotId: chatbot.id,
          type: 'Website',
          sourceDetails: JSON.stringify({ url }),
        }))
      );
    }

    // Handle documents
    if (documents.length > 0) {
      dataSources.push(
        ...documents.map((doc) => ({
          chatbotId: chatbot.id,
          type: 'Document',
          sourceDetails: JSON.stringify({ name: doc.content.name }),
        }))
      );
    }

    // Handle QandA
    if (QandA.length > 0) {
      dataSources.push(
        ...QandA.map((qa) => ({
          chatbotId: chatbot.id,
          type: 'QandA',
          sourceDetails: JSON.stringify({ question: qa.question, answer: qa.answer }),
        }))
      );
    }

    // Handle other sources
    if (otherSources.length > 0) {
      dataSources.push(
        ...otherSources.map((source) => ({
          chatbotId: chatbot.id,
          type: source.type,
          sourceDetails: JSON.stringify({ name: source.name }),
        }))
      );
    }

    // Bulk insert data sources
    if (dataSources.length > 0) {
      await prisma.dataSource.createMany({
        data: dataSources,
      });
    }

    // Step 3: Handle document uploads (if any)
    if (documents.length > 0) {
      const formData = new FormData();
      formData.append('userId', session.user.id.toString());
      formData.append('chatbotID', chatbot.id.toString());

      documents.forEach((doc) => {
        formData.append('documents', doc.content, doc.content.name);
      });

      const response = await fetch(`${SERVER_URL}/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          `Failed to process chatbot data: ${errorDetails.detail || response.statusText}`
        );
      }
    }

    return { chatbot, processingStatus: 'success' };
  } catch (error: any) {
    console.error('Error creating chatbot:', error.message);
    throw new Error(`Error creating chatbot: ${error.message}`);
  }
}
