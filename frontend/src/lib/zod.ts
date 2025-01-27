import { z } from "zod";


export const urlSchema = z.string().refine((value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, { message: 'Invalid URL format.' });


  export const fileSchema = z.array(
    z.custom<File>((file) => {
      const allowedTypes = ['text/plain', 'application/pdf', 'text/csv'];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
  
      if (!allowedTypes.includes(file.type)) {
        return false; // Invalid file type
      }
  
      if (file.size > maxSizeInBytes) {
        return false; // File size exceeds limit
      }
  
      return true; // File is valid
    }, { message: 'File type must be text, csv, or pdf, and size must be less than 2MB.' })
  );
  
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