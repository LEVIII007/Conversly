import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages} from "ai";
import { searchDocumentation } from "./utility";
import { z } from "zod";


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, tone, prompt, chatbotID } = await req.json();
  console.log("Messages:", messages);
  console.log("Tone:", tone);
  console.log("Prompt:", prompt);
  console.log("Chatbot ID:", chatbotID);

  // console.log(messages);

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    system: `[TONE] : ${tone} be respectful and helpful. provide value to the user. you have access to searchDocumentation tool to get information about shashank you do not have or you are not sure but you can only use it once. [SPECIAL INSTRUCTIONS] : ${prompt}. `,
    messages: convertToCoreMessages(messages),
    tools: {
      searchDocumentation: {
        description:
          "if you need help with a question, provide a detailed prompt and I will search the documentation for you.",
        parameters: z.object({
          prompt: z
            .string()
            .describe("The prompt to generate the embedding for, provide as much detail as possible.")
        }),
        execute: async ({ prompt }: { prompt: string }): Promise<string> => {
          try {
            const result = await searchDocumentation(prompt, chatbotID);
            console.log("Search documentation result:", result);
            return JSON.stringify(result);
          } catch (error: any) {
            return JSON.stringify({ error: error.message });
          }
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
