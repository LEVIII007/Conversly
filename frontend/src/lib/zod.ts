import { z } from "zod";

export const csvSchema = z.object({
  name: z.string().regex(/\.csv$/i, 'Invalid file type. Only CSV files are allowed.'), // Ensure it's a CSV
  size: z.number().max(5 * 1024 * 1024, 'File size exceeds the 5MB limit.'), // Maximum size of 5MB
});

export const documentSchema = z.object({
  name: z.string().regex(/\.(pdf|docx|txt)$/i, 'Invalid file type. Only PDF, DOCX, or TXT files are allowed.'), // Allowed file types
  size: z.number().max(10 * 1024 * 1024, 'File size exceeds the 10MB limit.') // Maximum size of 10MB
});


export const urlSchema = z.string().refine((value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, { message: 'Invalid URL format.' });
  
export const csv = z.object({
    file: z.custom<File>((value) => {
      // Ensure it's a File object
      if (!(value instanceof File)) {
        return false;
      }
  
      // Allowed file extensions
      const allowedExtensions = ["csv"];
      const fileName = value.name.toLowerCase();
      const fileExtension = fileName.split(".").pop();
  
      // Check file extension
      if (!allowedExtensions.includes(fileExtension || "")) {
        return false;
      }

      // Check file size (2MB limit)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (value.size > maxSizeInBytes) {
        return false;
      }
  
      return true;
    }, { message: "Invalid file type or size. Only CSV files under 2MB are allowed." }),
  });

  export const doc = z.object({
    file: z.custom<File>((value) => {
      // Ensure it's a File object
      if (!(value instanceof File)) {
        return false;
      }
  
      // Allowed file extensions
      const allowedExtensions = ['text/plain', 'application/pdf'];
      const fileName = value.name.toLowerCase();
      const fileExtension = fileName.split(".").pop();
  
      // Check file extension
      if (!allowedExtensions.includes(fileExtension || "")) {
        return false;
      }

      // Check file size (2MB limit)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (value.size > maxSizeInBytes) {
        return false;
      }
  
      return true;
    }, { message: "Invalid file type or size. Only CSV files under 2MB are allowed." }),
  });

export const chatbotSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Name cannot contain numbers or special characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(200, 'Description must be less than 200 characters')
    .regex(/^[A-Za-z\s]+$/, 'Description cannot contain special characters'),
  systemPrompt: z
    .string()
    .max(1000, 'System Prompt must be less than 1000 characters')
    .refine((value) => {
      // Define a list of harmful content patterns
      const harmfulContentPatterns = [
        /harmful/i,
        /hateful/i,
        /violent/i,
        /abuse/i,
        /assault/i,
        /kill/i,
        /murder/i,
        /rape/i,
        /suicide/i,
        /terrorist/i,
        /bomb/i,
        /drugs?/i,
        /weapon/i,
        /fuck/i,
        /shit/i,
        /bitch/i,
        /cunt/i,
        /nigg/i, // Caution: This is a sensitive term
        /whore/i,
        /slut/i,
        /porn/i,
        /sexually/i,
        /explicit/i,
        /offensive/i,
        /racist/i,
        /sexist/i,
        /discriminatory/i,
      ];

      // Check if the system prompt contains any harmful content
      const containsHarmfulContent = harmfulContentPatterns.some((pattern) =>
        pattern.test(value)
      );

      // Return false if harmful content is found
      return !containsHarmfulContent;
    }, { message: 'System Prompt contains harmful or inappropriate content' }),
});