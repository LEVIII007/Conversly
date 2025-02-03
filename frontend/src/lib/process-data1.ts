'use server';

import { prisma } from '../../prisma';
import { auth } from '../../auth';
import dotenv from 'dotenv';
import { redirect } from 'next/navigation';
import { subscriptionStatus } from './subscription-provider';

dotenv.config();

interface Document {
  type: 'pdf' | 'txt' | 'xml' | 'csv' | 'json' | 'mdx';
  content: File;
}

interface QandA {
  question: string;
  answer: string;
}

interface CSV {
  type: 'csv';
  content: File;
}

interface ChatBot {
  name: string;
  description: string;
  System_Prompt: string;
  website_URL?: string[]; // Optional
  documents?: Document[]; // Optional
  QandA?: QandA[]; // Optional
  CSV? : CSV[]; // Optional
  otherSources?: { type: string; name: string }[]; // Optional
}

// const SERVER_URL = process.env.API_SERVER_URL ?? 'http://localhost:3001';
const SERVER_URL =  'http://localhost:3001';
export async function createChatBot({
  name,
  description,
  System_Prompt,
}: ChatBot) {
  const session = await auth();

  // Ensure the user is authenticated.
  if (!session || !session.user?.id) {
    throw new Error('User is not authenticated.');
  }

  try {
    const result = await prisma.$transaction(async (prismaTx) => {
      // Check subscription status and determine the chatbot limit.
      const isSubscribed = await subscriptionStatus(session?.user?.id as string);
      const chatbotLimit = isSubscribed ? 10 : 2;

      // Count the existing chatbots for the user.
      const userChatbotsCount = await prismaTx.chatBot.count({
        where: { userId: session?.user?.id },
      });

      if (userChatbotsCount >= chatbotLimit) {
        throw new Error('You have reached the maximum number of chatbots allowed.');
      }

      // Create the chatbot.
      const chatbot = await prismaTx.chatBot.create({
        data: {
          name,
          description,
          System_Prompt,
          userId: session?.user?.id as string,
        },
      });

      // Initialize the analytics row for the new chatbot.
      await prismaTx.analytics.create({
        data: {
          chatbotid: chatbot.id, // Link to the newly created chatbot.
          responses: 0,
          likes: 0,
          dislikes: 0,
        },
      });

      return { chatbot, processingStatus: 'success' };
    });

    return result;
  } catch (error: any) {
    console.error('Error creating chatbot:', error.message);
    throw new Error(`Error creating chatbot: ${error.message}`);
  }
}
interface addKnowledge {
  chatbotID: string;
  website_URL?: string[];
  documents?: Array<{ type: 'pdf' | 'txt'; content: File }>;
  qandaData?: Array<{ question: string; answer: string }>;
  CSV?: Array<{ type: 'csv'; content: File }>;
}

export async function addKnowledge({
  chatbotID,
  website_URL = [],
  documents = [],
  qandaData = [],
  CSV = [],
}: addKnowledge) {
  console.log('addKnowledge');
  console.log(website_URL);
  console.log(documents);
  console.log(qandaData);
  console.log(CSV);
  const session = await auth();

  try {
    // Ensure the user is authenticated
    if (!session || !session?.user?.id) {
      throw new Error('User is not authenticated.');
    }
    const isSubscribed = await subscriptionStatus(session.user.id);
    const maxDataSources = isSubscribed ? 25 : 2;

    // Check if the user has exceeded the maximum number of data sources
    const existingSourcesCount = await prisma.dataSource.count({
      where: {
        chatbotId: parseInt(chatbotID),
      },
    });

    if (existingSourcesCount + website_URL.length + documents.length + qandaData.length + CSV.length > maxDataSources) {
      throw new Error('You have reached the maximum number of data sources allowed for this chatbot.');
    }

    // Prepare FormData for the backend request
    const formData = new FormData();
    formData.append('userId', session.user.id.toString());
    formData.append('chatbotID', chatbotID);

    const dataSources = [];

    // Add website URLs if they exist
    if (website_URL.length > 0) {
      formData.append('websiteURL', JSON.stringify(website_URL)); // Backend will parse this JSON
    }

    if(CSV.length > 0) {
      CSV.forEach((csv, index) => {
        formData.append('csvFiles', csv.content, csv.content.name);
      });
    }

    // Add documents if they exist
    if (documents.length > 0) {
      documents.forEach((doc, index) => {
        formData.append('documents', doc.content, doc.content.name);
      });
    }

    // Add Q&A data if it exists
    if (qandaData.length > 0) {
      formData.append('qandaData', JSON.stringify(qandaData));
    }

    console.log(formData);
    // Send the request to the backend for processing
    fetch(`${SERVER_URL}/process`, {
      method: 'POST',
      body: formData,
    });
    
    return { chatbotID, processingStatus: 'success' };
  } catch (error: any) {
    if (error.message.includes('maximum number of data sources')) {
      console.error('Error adding knowledge:', error.message);
      throw new Error('You have reached the maximum number of data sources allowed for this chatbot.');
    } else {
      console.error('Error adding knowledge:', error.message);
      throw new Error(`Error adding knowledge: ${error.message}`);
    }
  }
}

