import { Request, Response } from 'express';
import { google } from '@ai-sdk/google';
import { CoreMessage, generateText, tool } from 'ai';
import { z } from 'zod';
import { searchDocumentation, updateAnalytics, updateResponse } from '../lib/db.js';


export async function responseHandler(req: Request, res: Response) {
  try {
    const { message, chatbotId, prompt } = req.body;
    console.log(message)

    if (!message || !chatbotId) {
      return res.status(400).json({ error: 'Message and chatbotId are required' });
    }
    const citations : string[] = [];

    const result = await generateText({
      model: google('gemini-1.5-flash-002'),
      system: `
      You are a highly intelligent and user-friendly chatbot embedded on a website to assist users by providing accurate and relevant information. Your goal is to understand the user's query, search the knowledge base when required, and respond in a professional yet approachable tone.
      
      **Guidelines**:
      1. Always provide clear, concise, and well-structured responses in **Markdown** format.
      2. If the query involves factual information, technical details, or specifics that you cannot answer confidently, use the \`getInformation\` tool.
      3. Use a conversational tone while maintaining professionalism.
      4. When summarizing retrieved information, ensure accuracy and relevance. Avoid unnecessary verbosity.
      5. Avoid making up answers. If you cannot provide a response, state that clearly and guide the user on how to proceed.
      
      **Output Format**:
      - Use Markdown for responses.
      - Examples of formatting:
        - **Headings**: Use \`#\`, \`##\`, or \`###\` for headings.
        - **Lists**: Use \`-\` or \`*\` for bullet points.
        - **Code Blocks**: Use triple backticks (\`\`\`) for code snippets.
        - **Links**: Use \`[Link Text](URL)\` for hyperlinks.
      
      **Tool Information**:
      1. **Tool Name**: \`getInformation\`
         - **Purpose**: Retrieve specific information from the knowledge base based on the user's query.
         - **Usage**: Use this tool only when the query requires detailed or factual information not directly available to you.
         - **Parameters**:
           - \`prompt\`: A descriptive string explaining the information needed.
         - **Response Handling**: Parse the retrieved information and present it in an easy-to-understand format.
      
      **When to Use the Tool**:
      - Use \`getInformation\` if:
        - The query involves technical specifications or documentation details.
        - The user asks about specific features, settings, or options from the knowledge base.
        - You need clarification or context from the knowledge base to provide a precise answer.
      
      **Example Responses**:
      - If you know the answer:
        \`\`\`markdown
        ### How to reset my password?
        To reset your password, click on the **Forgot Password** link on the login page, and follow the instructions sent to your email.
        \`\`\`
      
      - If using the tool:
        1. Send a request with a descriptive prompt to the tool:
           \`\`\`markdown
           Let me fetch that information for you. One moment, please...
           \`\`\`
        2. Present the retrieved information:
           \`\`\`markdown
           ### Resetting Password
           Based on the knowledge base, you can reset your password by following these steps:
           1. Click **Forgot Password**.
           2. Enter your email address and follow the instructions.
           3. Check your email for the reset link.
           \`\`\`
           [SPECIAL INSTURCTIONS FROM USER] : ${prompt}
        `,
      prompt : message,
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
            result.forEach(item => {
              if (item.citation) {
              citations.push(item.citation);
              }
            });
            return result;
            },
          }),
          },
          maxSteps: 2,
        });
        console.log("++++++++++++++++result++++++++++++++++++++");
        try {
          if (citations.length == 0) {
          await updateResponse(chatbotId);
          } else {
          await updateAnalytics(chatbotId, citations);
          }
        } catch (updateError) {
          console.error('Error in update operations:', updateError);
        }
        return res.json({ answer: result.text, citations : citations });
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