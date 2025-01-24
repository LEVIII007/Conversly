import csv from 'csv-parser';

interface QnAPair {
  question: string;
  answer: string;
}

export const processCSV = async (file: Express.Multer.File): Promise<QnAPair[]> => {
  return new Promise((resolve, reject) => {
    const qnaPairs: QnAPair[] = [];
    const stream = file.buffer.toString('utf-8');

    // Create a readable stream from the file buffer
    const readable = require('stream').Readable.from(stream);

    readable
      .pipe(csv())
      .on('data', (row: any) => {
        // Assuming the columns in the CSV are labeled as 'Q' and 'A'
        if (row.Q && row.A) {
          qnaPairs.push({ question: row.Q, answer: row.A });
        }
      })
      .on('end', () => resolve(qnaPairs))
      .on('error', (err: Error) => reject(err));
  });
};

// Example usage for multiple CSV files
export const processMultipleCSVs = async (files: Express.Multer.File[]): Promise<QnAPair[]> => {
  const allQnAPairs: QnAPair[] = [];

  for (const file of files) {
    const fileQnAPairs = await processCSV(file); // Process each CSV file
    allQnAPairs.push(...fileQnAPairs); // Merge results into one array
  }

  return allQnAPairs;
};
