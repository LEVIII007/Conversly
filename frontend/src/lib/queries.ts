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