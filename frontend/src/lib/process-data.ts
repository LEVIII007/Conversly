'use server';

import { prisma } from '../../prisma';
import { auth } from '../../auth';

interface ChatBot {
  name: string;
  description: string;
  System_Prompt: string;
  website_URL: string[];
  documents: Array<{ type: 'pdf' | 'txt'; content: File }>;
}

const SERVER_URL = 'http://localhost:8000';

export async function createChatBot({
  name,
  description,
  System_Prompt,
  website_URL,
  documents,
}: ChatBot) {
  const session = await auth();

  try {
    // Ensure the user is authenticated
    if (!session || !session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // Create the chatbot in the database
    const chatbot = await prisma.chatBot.create({
      data: {
        name,
        description,
        System_Prompt,
        website_URL,
        userId: session.user.id, // Associate chatbot with the user
      },
    });

    // Prepare FormData for the backend request
    const formData = new FormData();
    formData.append('chatbotID', chatbot.id.toString());
    formData.append('websiteURL', JSON.stringify(website_URL)); // Backend will parse this JSON

    documents.forEach((doc, index) => {
      formData.append('documents', doc.content, `document-${index}.${doc.type}`);
    });

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

    return { chatbot, processingStatus: 'success' };
  } catch (error: any) {
    console.error('Error creating chatbot:', error.message);
    throw new Error(`Error creating chatbot: ${error.message}`);
  }
}




interface addKnowledge {
  chatbotID : string;
  website_URL: string[];
  documents: Array<{ type: 'pdf' | 'txt'; content: File }>;
}

export async function addKnowledge({
  chatbotID,
  website_URL,
  documents,
}: addKnowledge) {
  const session = await auth();

  try {
    // Ensure the user is authenticated
    if (!session || !session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // Prepare FormData for the backend request
    const formData = new FormData();
    formData.append('chatbotID', chatbotID);
    formData.append('websiteURL', JSON.stringify(website_URL)); // Backend will parse this JSON

    documents.forEach((doc, index) => {
      formData.append('documents', doc.content, `document-${index}.${doc.type}`);
    });

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
