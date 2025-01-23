import { Request, Response } from 'express';
import { google } from '@ai-sdk/google';
import { CoreMessage, generateText, tool } from 'ai';
import { z } from 'zod';
import { searchDocumentation } from '../lib/db.js';


export async function responseHandler(req: Request, res: Response) {
  try {
    const { message, chatbotId, prompt } = req.body;

    if (!message || !chatbotId) {
      return res.status(400).json({ error: 'Message and chatbotId are required' });
    }


    const result = await generateText({
      model: google('gemini-1.5-flash-002'),
      system : "",
      prompt : prompt,
      tools: {
        getInformation: tool({
          description: 'Get the information from the knowledge base for the given prompt',
          parameters: z.object({
            prompt: z
              .string()
              .describe('The prompt to get the information for, this must be as descriptive as possible'),
          }),
          execute: async ({ prompt }) => {
            const result = await searchDocumentation(prompt, chatbotId);
            return result;
          },
        }),
      },
      maxSteps: 5,
      onStepFinish: step => {
        // You can log steps or send them as events if needed
        console.log(JSON.stringify(step, null, 2));
      },
    });
    return result.text;

  } catch (error) {
    console.error('Error in response handler:', error);
    // If headers haven't been sent, send error response
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // If streaming has started, send error event
      res.write(`data: ${JSON.stringify({ error: 'generateText error occurred' })}\n\n`);
      res.end();
    }
  }
}