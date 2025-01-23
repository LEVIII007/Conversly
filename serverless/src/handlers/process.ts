import { Response } from 'express';
import pdfParse from 'pdf-parse';
import { generateEmbeddings } from '../lib/embeddings.js';
import { splitDocument, getContentType } from '../lib/splitter.js';
import {bulkSaveEmbeddings, bulkSaveDataSources } from '../lib/db.js';
import { ProcessRequestBody } from '../lib/types.js';
import multer from 'multer';
import { Request } from 'express';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

async function readFileContent(file: Express.Multer.File): Promise<string> {
  const contentType = getContentType(file.originalname);

  if (contentType === 'application/pdf') {
    // pdf-parse expects a Buffer directly
    const pdfData = await pdfParse(file.buffer);
    return pdfData.text;
  }

  // For text files
  return file.buffer.toString('utf-8');
}


// async function processDocument(
//   file: File,
//   chatbotId: number
// ): Promise<void> {
//   try {
//     // Read file content
//     const content = await readFileContent(file);
    
//     // Split into chunks using semantic chunking for documents
//     const chunks = await splitDocument(
//       content,
//       'semantic',
//       { source: file.name, type: 'document' }
//     );
    
//     // Generate embeddings for each chunk
//     const texts = chunks.map(chunk => chunk.text);
//     const embeddings = await generateEmbeddings(texts);
    
//     // Save embeddings to database
//     await Promise.all(
//       chunks.map((chunk, index) =>
//         saveEmbeddings(
//           chatbotId,
//           file.name,
//           chunk.text,
//           embeddings[index]
//         )
//       )
//     );
    
//     // Save document source
//     await saveDataSource(
//       chatbotId,
//       'Document',
//       file.name,
//       { type: getContentType(file.name) }
//     );
//   } catch (error) {
//     console.error('Error processing document:', error);
//     throw error;
//   }
// }

// async function processWebsiteContent(
//   url: string,
//   content: string,
//   chatbotId: number
// ): Promise<void> {
//   try {
//     // Split content into chunks using semantic chunking
//     const chunks = await splitDocument(
//       content,
//       'semantic',
//       { source: url, type: 'website' }
//     );
    
//     // Generate embeddings for chunks
//     const texts = chunks.map(chunk => chunk.text);
//     const embeddings = await generateEmbeddings(texts);
    
//     // Save embeddings
//     await Promise.all(
//       chunks.map((chunk, index) =>
//         saveEmbeddings(
//           chatbotId,
//           url,
//           chunk.text,
//           embeddings[index]
//         )
//       )
//     );
    
//     // Save website source
//     await saveDataSource(
//       chatbotId,
//       'Website',
//       url,
//       { url }
//     );
//   } catch (error) {
//     console.error('Error processing website:', error);
//     throw error;
//   }
// }

export const processHandler = [
  upload.array('documents'),
  async (req: Request, res: Response) => {
    try {
      const userID = req.body.userId;
      const chatbotID = req.body.chatbotID;
      const websiteURL = JSON.parse(req.body.websiteURL || '[]');
      const qandaData = JSON.parse(req.body.qandaData || '[]');
      const documents = (req.files as Express.Multer.File[] || []);

      console.log('Received data:', {
        chatbotID,
        websiteURL,
        qandaData,
        documents: documents.map(f => f.originalname)
      });

      const chatbotId = parseInt(chatbotID);
      
      let allChunks: { text: string; source: string }[] = [];
      let dataSourcesToSave: { type: string; name: string; sourceDetails: any }[] = [];

      // Process documents
      if (documents.length > 0) {
        for (const file of documents) {
          const content = await readFileContent(file);
          const chunks = await splitDocument(content, 'semantic', {
            source: file.originalname,
            type: 'document'
          });
          
          allChunks.push(...chunks.map(chunk => ({
            text: chunk.text,
            source: file.originalname
          })));
          
          dataSourcesToSave.push({
            type: 'Document',
            name: file.originalname,
            sourceDetails: { type: getContentType(file.originalname) }
          });
        }
      }

      // Process websites
      if (websiteURL.length > 0) {
        const response = await fetch(`${process.env.CRAWL_API_URL}/crawl`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: websiteURL })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch website content');
        }

        const contents = await response.json();
        
        for (let i = 0; i < websiteURL.length; i++) {
          const chunks = await splitDocument(contents[i], 'semantic', {
            source: websiteURL[i],
            type: 'website'
          });
          allChunks.push(...chunks.map(chunk => ({
            text: chunk.text,
            source: websiteURL[i]
          })));
          
          dataSourcesToSave.push({
            type: 'Website',
            name: websiteURL[i],
            sourceDetails: { url: websiteURL[i] }
          });
        }
      }

      // Process Q&A pairs
      if (qandaData.length > 0) {
        const qandaTexts = qandaData.map(
          qa => `Question: ${qa.question}\nAnswer: ${qa.answer}`
        );
        allChunks.push(...qandaTexts.map((text, i) => ({
          text,
          source: qandaData[i].question
        })));
        
        dataSourcesToSave.push({
          type: 'QandA',
          name: 'Q&A Pairs',
          sourceDetails: { count: qandaData.length }
        });
      }

      // Generate embeddings for all chunks in one go
      if (allChunks.length > 0) {
        const texts = allChunks.map(chunk => chunk.text);
        const embeddings = await generateEmbeddings(texts);

        // Prepare data for bulk insert
        const embeddingsData = allChunks.map((chunk, i) => ({
          userId : userID,
          chatbotId,
          topic: chunk.source,
          text: chunk.text,
          embedding: embeddings[i]
        }));

        // // Prepare data sources for bulk insert
        // const dataSourcesData = dataSourcesToSave.map(source => ({
        //   chatbotId,
        //   type: source.type as "Website" | "QandA" | "Document",
        //   name: source.name,
        //   sourceDetails: source.sourceDetails
        // }));

        // Perform bulk inserts
        await bulkSaveEmbeddings(embeddingsData);
        // await bulkSaveDataSources(dataSourcesData);
        
        return res.status(200).json({ status: 'success' });
      }
    } catch (error) {
      console.error('Error in process handler:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
]; 