'use server';

import { prisma } from '../../prisma';
import { auth } from '../../auth';


export async function getChatBots() {
    const session = await auth();
    console.log(session);
    console.log("+++++++++++")
    
    try {
        // Ensure the user is authenticated
        if (!session || !session?.user?.id) {
        throw new Error('User is not authenticated.');
        }
    
        // Get all chatbots associated with the user
        const chatbots = await prisma.chatBot.findMany({
        where: {
            userId: session.user.id,
        },
        });
        console.log(chatbots);
        return chatbots;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function DeleteChatBot({
    id,
}: {
    id: number,
}) {
    const session = await auth();
    
    try {
        // Ensure the user is authenticated
        if (!session || !session?.user?.id) {
            throw new Error('User is not authenticated.');
        }
    
        // Delete the chatbot with the specified id
        const chatbots = await prisma.chatBot.delete({
            where: {
                id: id,
            },
        });
    
        return chatbots;
    } catch (error) {
        console.error(error);
        return [];
    }
}


// FETCH the website urls of a chat bot from db, then for each website url, delete embeddings from embedding table
// this function will then send req to /process with al l website urls array to process them again.  
export async function UpdateKnowledgeBase({
    id,
}: {
    id: number,
}) {
    const session = await auth();
    
    try {
        // Ensure the user is authenticated
        if (!session || !session?.user?.id) {
            throw new Error('User is not authenticated.');
        }
    
        const result = await prisma.chatBot.findUnique({
            where: {
            id: id,
            },
            select: {
            website_URL: true,
            },
        });
        console.log(result);
        if(!result) {
            throw new Error('Chatbot not found.');
        }
        // Delete the embeddings associated with the website urls
        for (const websiteUrl of result?.website_URL as string[]) {
            await prisma.embeddings.deleteMany({
                where: {
                    topic: websiteUrl,
                },
            });
        }

        const formData = new FormData();
        formData.append('userId', session.user.id.toString());
        formData.append('chatbotID', id.toString());
        formData.append('websiteURL', JSON.stringify(result.website_URL)); // Backend will parse this JSON
        // Send a request to the /process endpoint to process the website urls again
        const response = await fetch(`${process.env.SERVER_URL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData,
        });
        return response;
    } catch (error) {
        console.error(error);
        return [];
    }
}



export const deleteKnowledge = async (id: number, topic : string) => {
    const session = await auth();
    try {
        // Ensure the user is authenticated
        if (!session || !session?.user?.id) {
            throw new Error('User is not authenticated.');
        }
        // Delete the embeddings associated with the website urls
        await prisma.embeddings.deleteMany({
            where: {
                chatbotid: id,
                topic: topic,
            },
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}



// export const updateWebsite = async (id: number, website_URL: string[]): Promise<void> => {
//     const session = await auth();
//     try {
//         // Ensure the user is authenticated
//         if (!session || !session?.user?.id) {
//             throw new Error('User is not authenticated.');
//         }
//         const result = await prisma.embeddings.deleteMany({
//             where: {
//                 chatbotid: id && website_URL,
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// }



