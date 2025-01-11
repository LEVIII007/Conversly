import { Pool } from "pg";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { format } from "path";

dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:igJqdQcAs8G6@ep-broad-cell-a10ico6t-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require", // Replace with your database connection string
  max: 5,
});

export async function searchDocumentation(
  prompt: string,
  chatbotID: string
): Promise<{ error: string } | { text: any }[]> {
  console.log("searchDocumentation called!");
  console.log("Prompt:", prompt);
  console.log("Chatbot ID:", chatbotID);
  try {
    // Initialize Google AI model
    const googleai = new GoogleGenerativeAI(process.env.API_KEY as string).getGenerativeModel({
      model: "text-embedding-004",
    });

    // Clean up the prompt
    prompt = prompt.replace(/\n/g, " ");

    // Generate the embedding for the prompt
    const result = await googleai.embedContent("Shashank Tyagi ♂phone+91 9528921966 /envel⌢petyagishashank118@gmail.com /linkedinLinkedIn /githubGitHub /gl⌢bePortfolio /codeLeetCode Education Indian Institute of Information Technology Nagpur Nov 2022 – Present Bachelor of Technology in Computer Science Nagpur, India •Relevant Coursework: Data Structures and Algorithms ,Database Management Systems ,Computer Networks , Object-Oriented Programming Technical Skills Languages : Python, C/C++, JavaScript, TypeScript Web Development : React, Next.js, Node.js, Express.js, Django, Flask Databases and ORMs : MongoDB, PostgreSQL, Prisma, Redis, Kafka Deep Learning & AI : Transformers, NLP(proficient), LSTM Developer Tools : Git, Postman, VS Code, Docker, Linux Experience Schachner Industries Private Limited May 2024 – July 2024 Backend Developer Intern (Remote) •Developed a comprehensive Admin Panel, optimizing management workflows and increasing operational efficiency by 25%. •Collaborated with cross-functional teams to resolve backend and database issues, achieving a 95% issue resolution rate and ensuring seamless project delivery. Projects Realtime Collaborative Workspace Live Link Aug 2024 – Oct 2024 Next.js, Drizzle ORM, WebSockets, Redis, Kafka •Created a real-time collaborative Document workspace enabling multiple users to work simultaneously, with live cursors, text selection, and real-time chat to boost team collaboration. •Utilized WebSockets to broadcast changes in a workspace and chat in real-time to other collaborators, with Redis Pub/Sub for efficient message broadcasting. •Designed an event-driven architecture using Apache Kafka to handle high-throughput, enabling reliable message delivery and scalable application performance across multiple instances. Rate Limiting and Web Protection SaaS Platform Live Link Dec 2024 – Present Node.js, AWS Lambda, Redis, PostgreSQL, Prisma •Built aserverless backend on AWS Lambda, offering less than 100 ms latency for rate limiting, bot protection, and SQL injection prevention. •Developed an npm middleware package for seamless integration, capable of blocking confirmed threats locally in under 5 ms. •Designed a documentation website to allow users to generate API keys and explore integration guidelines. •Created an independent rate-limiting library , implementing reusable algorithms");
    const embedding = result.embedding.values;
    console.log("Original embedding size:", embedding.length);
    console.log("Original embedding:", embedding);


    // Prepare query for cosine similarity search
    const query = `
    SELECT topic, text
    FROM "embeddings"
    WHERE "chatbotid" = $1
    ORDER BY embedding <=> '[${embedding}]'
    LIMIT 1;
  `;

  // console.log("Formatted embedding:", formattedEmbedding);


    const client = await pool.connect();

    const queryResponse = await client.query(
      `SELECT text
      FROM "embeddings"
      WHERE "chatbotid" = $1`,
      [chatbotID]
    );

    console.log("Query response:", queryResponse);



    if (!client) {
      throw new Error("Failed to connect to the database.");
    }
    console.log("Connected to database!");
    console.log("Query:", query);
    try {
      const res = await client.query(query, [5]);


      console.log("Query result:", res);
      if (res.rows.length === 0) {
        return { error: "No matching documentation found." };
      }

      const results = res.rows.map((row) => ({ text: row.text }));
      return results;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: "An unexpected error occurred." };
  }
}
