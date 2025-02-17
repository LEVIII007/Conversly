'use server';

import { exec } from 'child_process';
import util from 'util';
import { auth } from '../../auth';

const execPromise = util.promisify(exec);

interface Req {
    message: string;
    prompt: string;
    chatbotId: string;
}

// In-memory rate limiting store
const requestStore: Map<string, number[]> = new Map();
const RATE_LIMIT = 3; // Maximum requests allowed per user
const TIME_WINDOW = 60 * 60 * 1000; // Time window in milliseconds (1 minute)

function isRateLimited(userId: string): boolean {
    const now = Date.now();

    if (!requestStore.has(userId)) {
        requestStore.set(userId, []);
    }

    // Get timestamps of previous requests
    const timestamps = requestStore.get(userId)!;

    // Remove expired timestamps
    while (timestamps.length > 0 && timestamps[0] <= now - TIME_WINDOW) {
        timestamps.shift();
    }

    // Check if rate limit is exceeded
    if (timestamps.length >= RATE_LIMIT) {
        return true;
    }

    // Add new request timestamp
    timestamps.push(now);
    return false;
}

export async function response(req: Req) {
    try {
        const { message, prompt, chatbotId} = req;
        const session = await auth();
        const userId = session?.user?.id;

        // Ensure userId exists
        if (!userId) {
            return {success: false, message: "User ID not found."};
        }

        // Rate limit check
        if (isRateLimited(userId)) {
            return {success : false, message: "Rate limit exceeded. Try again later."};
        }

        console.log('Calling API at:', process.env.RESPONSE_API_URL);
        console.log('Using API Key:', process.env.RESPONSE_API_KEY ? '✅ Loaded' : '❌ Not Set');
        console.log('User ID:', userId);
        console.log('Chatbot ID:', chatbotId);

        if (!process.env.RESPONSE_API_URL) {
            return {success: false, message: "Missing RESPONSE_API_URL in environment variables."};
        }
        if (!process.env.RESPONSE_API_KEY) {
            return {success: false, message: "Missing RESPONSE_API_KEY in environment variables."};
        }

        // Construct the curl command
        const curlCommand = `
        curl -s POST "${process.env.RESPONSE_API_URL}/response" \
             -H "Content-Type: application/json" \
             -H "x-api-key: ${process.env.RESPONSE_API_KEY}" \
             -d '${JSON.stringify({ message, prompt, chatbotId })}'
        `;

        // Execute the curl command
        const { stdout, stderr } = await execPromise(curlCommand.trim());
        if (stderr) {
            console.error("Curl Error:", stderr);
            throw new Error(`Curl command failed: ${stderr}`);
        }

        console.log("Curl Response:", stdout);

        // Ensure valid JSON before parsing
        let data;
        try {
            data = JSON.parse(stdout.trim());
        } catch (parseError) {
            console.error("Response is not valid JSON:", stdout);
            return {success: false, message: "Invalid response from API."};
        }

        if (!data || typeof data !== "object" || !data.answer || !data.citations) {
            console.error("Invalid response data:", data);
            return {success: false, message: "Invalid response data from API."};
        }
        return { answer: data.answer, citations: data.citations };
    } catch (error: any) {
        console.error("Error in response function:", error);
        throw error;
    }
}
