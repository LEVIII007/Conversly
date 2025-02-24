'use server';
import { prisma } from "../../prisma"
import { auth } from "../../auth"
import { redirect } from "next/navigation";

export async function subscriptionStatus(userId : string) {
    try {
        const status = await prisma.subscribedusers.findFirst({
            where: {
                userid: userId,
            },
        });

        if (status) {
            return status;
        }
        return false;
    } catch (error) {
        console.error("Error fetching subscription status:", error);
        throw new Error("Failed to fetch subscription status");
    }
}
