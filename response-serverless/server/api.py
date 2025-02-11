from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from pydantic_ai_expert import pydantic_ai_expert, PydanticAIDeps
from db_queries import update_analytics, DatabasePool
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.on_event("startup")
async def startup():
    await DatabasePool.get_pool()

@app.on_event("shutdown")
async def shutdown():
    await DatabasePool.close_pool()

class ChatRequest(BaseModel):
    message: str
    chatbotId: str
    prompt: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[str]
    success: bool
    message: Optional[str] = None

@app.post("/response", response_model=ChatResponse)
async def handle_response(request: ChatRequest):
    try:
        deps = PydanticAIDeps(openai_client=openai_client, chatbotId=request.chatbotId)
        
        # Get response from Pydantic AI agent
        result = await pydantic_ai_expert.run(
            request.message,
            deps=deps
        )
        # print(result)
        print(result.data.response)
        print(type(result.data.citations))
        # Update analytics before returning response
        await update_analytics(request.chatbotId, result.data.citations)
        
        return {
            "answer": result.data.response,
            "citations": result.data.citations,
            "success": True
        }
        
    except Exception as e:
        return {
            "answer": "",
            "citations": [],
            "success": False,
            "message": str(e)
        }


# [<Record text='# Shashank Tyagi\n\n+91 9528921966 | tyagishashank118@gmail.com | [LinkedIn](LINK_TO_LINKEDIN) | [GitHub](LINK_TO_GITHUB) | [Portfolio](LINK_TO_PORTFOLIO) | [LeetCode](LINK_TO_LEETCODE)\n\n\n## Education\n\n**Indian Institute of Information Technology Nagpur**  (Nov 2022 – Present)\n* Bachelor of Technology in Computer Science, Nagpur, India\n* **Relevant Coursework:** Data Structures and Algorithms, Database Management Systems, Computer Networks, Object-Oriented Programming\n\n\n## Technical Skills\n\n### Languages\n* Python\n* C/C++\n* JavaScript\n* TypeScript\n\n### Web Development\n* React\n* Next.js\n* Node.js\n* Express.js\n* Django\n* FastAPI\n\n### Databases and ORMs\n* MongoDB\n* PostgreSQL\n* Prisma\n* Redis\n* Kafka\n\n### Deep Learning & AI\n* Transformers\n* NLP (Proficient)\n* LSTM\n\n### Developer Tools and Platforms\n* Git\n* Postman\n* VS Code\n* Docker\n* Linux\n* AWS (Lambda, EC2, S3)\n\n\n## Experience\n\n**Schachner Industries Private Limited** (May 2024 – July 2024)\n* **Backend Developer Intern (Remote)**\n    * Developed a comprehensive Admin Panel, optimizing management workflows and increasing operational efficiency for internal teams.\n    * Collaborated with cross-functional teams to resolve backend and database issues.\n\n\n## Projects\n\n**Conversly.ai** ([Live Link](LINK_TO_CONVERSLY_AI)) (Jan 2024 – Present)\n* Next.js, Node.js, AWS EC2\n* Conversly.ai is a SaaS chatbot provider that allows businesses to deploy chatbots with custom knowledge bases for highly tailored responses.\n* Enables users to embed agentic RAG chatbots on their websites, Discord, and Slack channels with just a few lines of code, streamlining customer interactions.\n\n\n**Note:**  Please replace the bracketed placeholders (e.g., `[LINK_TO_LINKEDIN]`) with the actual links.\n' citation='Shashankkk_site.pdf'>, <Record text='# Projects\n\n## Rate Limiting and Web Protection SaaS Platform (Dec 2024 – Jan 2025)\n\n* **Technology Stack:** Node.js, AWS Lambda, Redis, PostgreSQL, Prisma\n* **Architecture:** Event-driven architecture using Apache Kafka for high-throughput, reliable message delivery, and scalable application performance across multiple instances.\n* **Backend:** Serverless backend on AWS Lambda with <100ms latency for rate limiting, bot protection, and SQL injection prevention.\n* **Integration:** Developed an npm middleware package for seamless integration, blocking confirmed threats locally in <5ms.\n* **Documentation:** Designed a documentation website for API key generation and integration guidelines.\n* **Rate-Limiting Library:** Created an independent rate-limiting library implementing token bucket and sliding window algorithms.\n* **Scalability:** Optimized for scalability and flexibility, supporting both centralized SaaS and decentralized use cases.\n* **Live Link:** [Insert Live Link Here]\n\n\n## Cloud Vault (Dec 2024 – Present)\n\n* **Technology Stack:** Node.js, AWS S3, Lambda, CloudFront, Typescript\n* **Overview:** Subscription-based cloud storage service offering scalable and secure file storage, sharing, and quick downloads via AWS CloudFront.\n* **Security:** Integrated AWS Lambda functions with S3 triggers to scan uploaded files for harmful content.\n* **Live Link:** [Insert Live Link Here]\n\n\n# Achievements\n\n* **Competitive Programming:**\n    * CodeChef 3-Star Rated (1775 max rating)\n    * LeetCode Knight (1991 contest rating)\n* **LeetCode Contests:**\n    * Rank 327/32,166 in LeetCode Weekly Contest 399\n    * Rank 495/30,286 in Biweekly Contest 131 (solved 3/4 algorithmic problems)\n* **Hackathons:**\n    * Finalist in Odoo Combat 2024 Hackathon (developed a CRM system to reduce client service time)\n    * 1st Place (out of 650 teams) in Bug Bounty Blitz and GPT-Solvathon Hackathon at IIITN Tantrafiesta 2024 (developed an innovative assistant with real-time stock market information using WebSockets)\n\n' citation='Shashankkk_site.pdf'>]
# response='Shashank Tyagi is currently a student at the Indian Institute of Information Technology Nagpur pursuing a Bachelor of Technology in Computer Science. His technical skills are diverse, spanning programming languages like Python, C/C++, JavaScript, and TypeScript. He is skilled in web development technologies including React, Next.js, Node.js, Express.js, Django, and FastAPI. Shashank also has experience with databases and ORMs such as MongoDB, PostgreSQL, Prisma, Redis, and Kafka, as well as deep learning and AI technologies like transformers, NLP, and LSTM. He has proficiency in developer tools and platforms such as Git, Postman, VS Code, Docker, Linux, and AWS services like Lambda, EC2, and S3.\n\nShashank has worked as a Backend Developer Intern at Schachner Industries Private Limited, where he developed an admin panel and collaborated on backend and database issues. He has also worked on projects including a SaaS chatbot provider (Conversly.ai), a rate limiting and web protection platform, and a cloud storage service (Cloud Vault). His achievements include being a competitive programmer with notable ratings and ranks in various contests and hackathons.' citations=['Shashankkk_site.pdf']
# <class 'pydantic_ai_expert.ResultType'>