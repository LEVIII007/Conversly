'use server';

import { prisma } from '../../prisma';
import { auth } from '../../auth';


export async function fetchChatBot(id: number) {
  try {
    const chatbot = await prisma.chatBot.findUnique({
      where: { id },
      select : {
        System_Prompt : true,
        name : true,
      }
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

export async function AuthStatus() {
  const session = await auth();
  if(session) {
    return {isLoggedIn: true};
  } else {
    return {isLoggedIn: false};
  }
}

export async function getUserIdbyChatbotId(chatbotId: number) {
  try {
    const chatbot = await prisma.chatBot.findUnique({
      where: { id: chatbotId },
      select: {
        userId: true
      }
    });

    return chatbot?.userId;
  } catch (error) {
    console.error('Error fetching chatbot:', error);
    return null;
  }
}

export async function getChatbotWithOwnership(chatbotId: number) {
  console.log("Fetching chatbot with ownership:", chatbotId);
  try {
    const session = await auth();
    const chatbot = await prisma.chatBot.findUnique({
      where: { id: chatbotId },
      select: {
        id: true,
        name: true,
        description: true,
        System_Prompt: true,
        createdAt: true,
        userId: true,
      }
    });

    if (!chatbot) {
      return { status: "error", message: "Chatbot not found" };
    }

    if (chatbot.userId !== session?.user?.id) {
      return { status: "error", message: "Unauthorized" };
    }

    const dataSources = await prisma.dataSource.findMany({
      where: { chatbotId },
      select: {
        id: true,
        type: true,
        name: true,
        sourceDetails: true,
        createdAt: true,
      },
    });

    return { status: "success", data: { chatbot, dataSources } };
  } catch (error: unknown) {
    console.error("Error fetching chatbot:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}


export async function validateChatbotOwnership(chatbotId: number) {
  try {
    const session = await auth();
    if(!session){
      return { data: false };
    }
    const chatbot = await prisma.chatBot.findUnique({
      where: { id: chatbotId },
      select: {
        id: true,
        System_Prompt: true,
        name: true,
        userId: true
      }
    });

    return { data: chatbot, authorized : chatbot?.userId === session?.user?.id };
  } catch (error) {
    console.error('Error fetching chatbot:', error);
    return { data: false };
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
        userId: true,
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
export const deleteKnowledge = async (chatbotId: number, datasourceId: number) => {
  const session = await auth();
  try {
    if (!session?.user?.id) {
      throw new Error('User is not authenticated.');
    }

    await prisma.$transaction(async (tx) => {
      // First, delete the embeddings associated with the given chatbot and datasource
      await tx.embeddings.deleteMany({
        where: {
          chatbotid: chatbotId,
          dataSourceId: datasourceId,
        },
      });

      // Then, delete the DataSource record
      await tx.dataSource.deleteMany({
        where: {
          chatbotId: chatbotId,
          id: datasourceId, // use id field since that's the primary key in DataSource
        },
      });
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
        citation: true,
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




export async function getAnalytics(chatbotid: number) {
  try {
    // Fetch analytics record for the given chatbotId
    const analytics = await prisma.analytics.findUnique({
      where: { chatbotid },
      select: {
        id: true, // Get the analytics ID to fetch citations
        responses: true,
        likes: true,
        dislikes: true,
      },
    });

    if (!analytics) {
      return { responses: 0, likes: 0, dislikes: 0, citations: [] };
    }

    // Fetch citations for this analytics record
    const citations = await prisma.citation.findMany({
      where: { chatbotid: chatbotid },
      select: {
        source: true,
        count: true,
      },
    });

    return {
      responses: analytics.responses,
      likes: analytics.likes,
      dislikes: analytics.dislikes,
      citations,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { responses: 0, likes: 0, dislikes: 0, citations: [] }; // Return empty data on error
  }
}



export async function addCitation(chatbotId: number, dataSourceId: number, citation: string) {
  try {
    const result = await prisma.$transaction(async (prismaTx) => {
      // Step 1: Verify the DataSource exists
      const dataSource = await prismaTx.dataSource.findUnique({
        where: { id: dataSourceId },
        select: { citation: true },
      });
      if (!dataSource) {
        throw new Error('Data source not found');
      }

      // Step 2: Update the citation field in DataSource
      const updatedDataSource = await prismaTx.dataSource.update({
        where: { id: dataSourceId },
        data: { citation },
      });

      // Step 3: Update the citation field in all related embeddings
      await prismaTx.embeddings.updateMany({
        where: { dataSourceId },
        data: { citation },
      });

      return updatedDataSource;
    });

    return result;
  } catch (error) {
    console.error('Error adding citation:', error);
    return null;
  }
}



// queries.ts or similar
export async function fetchEmbeddingsForSource(dataSourceId: number): Promise<{ id: number; text: string; topic: string }[]> {
  try {
    const embeddings = await prisma.embeddings.findMany({
      where: {
        dataSourceId
      },
      select: {
        id : true,
        text: true,
        topic : true
      }
    });

    return embeddings.map((embedding: { id: number; text: string; topic: string }) => ({
      id: embedding.id,
      text: embedding.text,
      topic: embedding.topic
    }));
  } catch (error) {
    console.error('Error fetching embeddings:', error);
    return [];
  }
}

