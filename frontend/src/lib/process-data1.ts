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

    return { chatbot, processingStatus: 'success' };

  }
  catch (error: any) {
    console.error('Error creating chatbot:', error.message);
    throw new Error(`Error creating chatbot: ${error.message}`);
  }
}


interface addKnowledge {
  chatbotID: string;
  website_URL?: string[];
  documents?: Array<{ type: 'pdf' | 'txt'; content: File }>;
  qandaData?: Array<{ question: string; answer: string }>;
}

export async function addKnowledge({
  chatbotID,
  website_URL = [], // Default to an empty array
  documents = [], // Default to an empty array
  qandaData = [], // Default to an empty array
}: addKnowledge) {
  const session = await auth();

  try {
    // Ensure the user is authenticated
    if (!session || !session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // Prepare FormData for the backend request
    const formData = new FormData();
    formData.append('userId', session.user.id.toString());
    formData.append('chatbotID', chatbotID);

    // Add website URLs if they exist
    if (website_URL.length > 0) {
      formData.append('websiteURL', JSON.stringify(website_URL)); // Backend will parse this JSON
    }

    // Add documents if they exist
    if (documents.length > 0) {
      documents.forEach((doc, index) => {
        formData.append('documents', doc.content, `document-${index}.${doc.type}`);
      });
    }

    // Add Q&A data if it exists
    if (qandaData.length > 0) {
      qandaData.forEach((qa, index) => {
        formData.append(`qandaData[${index}][question]`, qa.question);
        formData.append(`qandaData[${index}][answer]`, qa.answer);
      });
    }

    // Send the request to the backend for processing
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

    return { chatbotID, processingStatus: 'success' };
  } catch (error: any) {
    console.error('Error creating chatbot:', error.message);
    throw new Error(`Error creating chatbot: ${error.message}`);
  }
}
