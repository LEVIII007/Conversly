'use server';

import { prisma } from '../../prisma';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';

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

const SERVER_URL = 'http://localhost:3000';

export async function createChatBot({
  name,
  description,
  System_Prompt,
}: ChatBot) {
  const session = await auth();

  try {
    // Check if the user already has 5 chatbots
    let userChatbotsCount = 0;
    try {
      userChatbotsCount = await prisma.chatBot.count({
        where: {
          userId: session?.user?.id,
        },
      });
    } catch (error) {
      console.error("Error counting chatbots:", error);
      // Handle the error appropriately, e.g., throw a more specific error or set a default value.
      // For now, we'll log the error and continue.  A better approach would be to
      // return a more informative error message to the client.
      return redirect('/profile');
    }

    if (userChatbotsCount >= 1) {
      // Show a toast message and redirect to the profile page
      throw new Error('You have reached the maximum number of chatbots allowed.');
    }

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
    if (error.message === 'You have reached the maximum number of chatbots allowed.') {
      // Show a toast message
      console.error('Error creating chatbot:', error.message);
      throw new Error('You have reached the maximum number of chatbots allowed.');
    } else {
      console.error('Error creating chatbot:', error.message);
      throw new Error(`Error creating chatbot: ${error.message}`);
    }
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
  const session = await auth();

  try {
    // Ensure the user is authenticated
    if (!session || !session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // Check if the user has exceeded the maximum number of data sources
    const existingSourcesCount = await prisma.dataSource.count({
      where: {
        chatbotId: parseInt(chatbotID),
      },
    });

    if (existingSourcesCount + website_URL.length + documents.length + qandaData.length > 2) {
      throw new Error('You have reached the maximum number of data sources allowed for this chatbot.');
    }

    // Prepare FormData for the backend request
    const formData = new FormData();
    formData.append('userId', session.user.id.toString());
    formData.append('chatbotID', chatbotID);

    const dataSources = [];

    if (website_URL.length > 0) {
      dataSources.push(...website_URL.map(url => ({
      chatbotId: parseInt(chatbotID),
      type: 'Website',
      name: url,
      sourceDetails: { url }
      })));
    }

    if (documents.length > 0) {
      dataSources.push(...documents.map(doc => ({
      chatbotId: parseInt(chatbotID),
      type: 'Document',
      name: doc.content.name,
      sourceDetails: { type: doc.type }
      })));
    }

    if (qandaData.length > 0) {
      dataSources.push({
      chatbotId: parseInt(chatbotID),
      type: 'QandA',
      name: qandaData.map(qanda => qanda.question).join(', '),
      sourceDetails: { count: qandaData.length }
      });
    }

    if(CSV.length > 0) {
      dataSources.push(...CSV.map(csv => ({
      chatbotId: parseInt(chatbotID),
      type: 'CSV',
      name: csv.content.name,
      sourceDetails: { type: csv.type }
      })));
    }

    if (dataSources.length > 0) {
      await prisma.dataSource.createMany({
      data: dataSources
      });
    }

    // Add website URLs if they exist
    if (website_URL.length > 0) {
      formData.append('websiteURL', JSON.stringify(website_URL)); // Backend will parse this JSON
    }

    if(CSV.length > 0) {
      CSV.forEach((csv, index) => {
        formData.append('CSV', csv.content, csv.content.name);
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
    if (error.message.includes('maximum number of data sources')) {
      console.error('Error adding knowledge:', error.message);
      throw new Error('You have reached the maximum number of data sources allowed for this chatbot.');
    } else {
      console.error('Error adding knowledge:', error.message);
      throw new Error(`Error adding knowledge: ${error.message}`);
    }
  }
}

