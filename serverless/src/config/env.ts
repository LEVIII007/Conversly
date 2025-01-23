import dotenv from 'dotenv';

dotenv.config();

export const config = {
  DATABASE_URL: process.env.DATABASE_URL!,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  CRAWL_API_URL: process.env.CRAWL_API_URL || 'http://localhost:3000/api'
}; 