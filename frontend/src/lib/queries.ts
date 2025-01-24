'use server';

import { prisma } from '../../prisma';
import { auth } from '../../auth';


export async function fetchChatBot(id: number) {
  try {
    const chatbot = await prisma.chatBot.findUnique({
      where: { id },
    });

    if (!chatbot) {
      return { status: 'error', message: 'Chatbot not found' };
    }

    return { status: 'success', data: chatbot };
  } catch (error: unknown) {
    console.error('Error fetching chatbot:', error);
    if (error instanceof Error) {
      return { status: 'error', message: error.message };
    }
    return { status: 'error', message: 'An unknown error occurred' };
  }
}

// Get all chatbots for the profile page
export async function getChatBots() {
  const session = await auth();
  try {
    // Ensure the user is authenticated
    if (!session || !session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // Get all chatbots associated with the user
    const chatbots = await prisma.chatBot.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });

    return chatbots;
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return [];
  }
}

// Delete chatbot along with embeddings and data sources
export async function DeleteChatBot({ id }: { id: number }) {
  const session = await auth();
  try {
    // Ensure the user is authenticated
    if (!session || !session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // Delete chatbot, cascading deletions to embeddings and data sources
    const chatbot = await prisma.chatBot.delete({
      where: { id },
    });

    return chatbot;
  } catch (error) {
    console.error('Error deleting chatbot:', error);
    return null;
  }
}

// Update knowledge base for a chatbot (only website URLs)
export async function UpdateKnowledgeBase({ id }: { id: number }) {
  const session = await auth();
  try {
    if (!session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // Fetch website URLs from DataSource
    const dataSources = await prisma.dataSource.findMany({
      where: {
        chatbotId: id,
        type: 'Website',
      },
      select: {
        sourceDetails: true,
      },
    });

    const websiteURLs = dataSources
      .map((source) => (source.sourceDetails as { url: string }).url)
      .filter(Boolean);

    if (!websiteURLs.length) {
      throw new Error('No website URLs found for the chatbot.');
    }

    // Delete embeddings for website URLs
    for (const websiteUrl of websiteURLs) {
      await prisma.embeddings.deleteMany({
        where: {
          chatbotid: id,
          topic: websiteUrl,
        },
      });
    }

    // Send request to reprocess website URLs
    const formData = new FormData();
    formData.append('userId', session.user.id.toString());
    formData.append('chatbotID', id.toString());
    formData.append('websiteURL', JSON.stringify(websiteURLs)); // Backend will parse this JSON

    const response = await fetch(`${process.env.SERVER_URL}/process`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to reprocess website URLs.');
    }

    return { status: 'success' };
  } catch (error: unknown) {
    console.error('Error updating knowledge base:', error);
    if (error instanceof Error) {
      return { status: 'error', message: error.message };
    }
    return { status: 'error', message: 'An unknown error occurred' };
  }
}

// Delete specific knowledge from a chatbot
export const deleteKnowledge = async (id: number, topic: string) => {
  const session = await auth();
  try {
    if (!session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    // First delete the embeddings
    await prisma.embeddings.deleteMany({
      where: {
        chatbotid: id,
        topic: topic,
      },
    });

    // Then delete the data source using the name field
    await prisma.dataSource.deleteMany({
      where: {
        chatbotId: id,
        name: topic,
      },
    });

    return { status: 'success' };
  } catch (error: unknown) {
    console.error('Error deleting knowledge:', error);
    if (error instanceof Error) {
      return { status: 'error', message: error.message };
    }
    return { status: 'error', message: 'An unknown error occurred' };
  }
};

// Fetch all data sources
export const fetchDataSources = async (id: number) => {
  console.log("Fetching data sources for chatbot:", id);
  try {
    const dataSources = await prisma.dataSource.findMany({
      where: {
        chatbotId: id,
      },
      select: {
        id: true,
        type: true,
        name: true,
        sourceDetails: true,
        createdAt: true,
      },
    });
    console.log(dataSources);
    return dataSources;
  } catch (error) {
    console.error('Error fetching data sources:', error);
    return [];
  }
};

// Add this function to update system prompt
export async function updateSystemPrompt(id: number, systemPrompt: string) {
  const session = await auth();
  try {
    if (!session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    const chatbot = await prisma.chatBot.update({
      where: { 
        id,
        userId: session.user.id // Ensure user owns the chatbot
      },
      data: {
        System_Prompt: systemPrompt,
      },
    });

    return chatbot;
  } catch (error) {
    console.error('Error updating system prompt:', error);
    throw error;
  }
}
