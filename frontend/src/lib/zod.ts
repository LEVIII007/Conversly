import { z } from "zod";

// 1. Validation for file uploads (e.g., CSV, TXT, PDF)
export const fileUploadSchema = z.object({
    file: z.custom<File>((value) => {
      // Ensure it's a File object
      if (!(value instanceof File)) {
        return false;
      }
  
      // Allowed file extensions
      const allowedExtensions = ["csv", "txt", "pdf"];
      const fileName = value.name.toLowerCase();
      const fileExtension = fileName.split(".").pop();
  
      return allowedExtensions.includes(fileExtension || "");
    }, { message: "Invalid file type. Only CSV, TXT, and PDF are allowed." }),
  });


  export const urlSchema = z.string().url({ message: 'Invalid URL format.' });
export const fileSchema = z.array(
    z.custom<File>((file) => {
        const allowedTypes = ['text/plain', 'application/pdf', 'text/csv'];
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            return false;
        }

        if (file.size > maxSizeInBytes) {
            return false;
        }

        return true;
    }, { message: 'File type must be text, csv, or pdf and size must be less than 2MB.' })
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

// 3. Validation for text prompts
export const inputSchema = z.string().min(1, { message: 'Message cannot be empty.' }); // Input validation
export const promptSchema = z.string().min(5, { message: 'Prompt must be at least 5 characters long.' }); // Optional prompt validation

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
      .min(20, 'System Prompt must be at least 5 characters long')
      .max(500, 'System Prompt must be less than 500 characters')
      .regex(/^[A-Za-z\s]+$/, 'System Prompt cannot contain special characters'),
  });