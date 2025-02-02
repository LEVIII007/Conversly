import express from 'express';
import {processHandler} from './handlers/process.js';
import {responseHandler} from './handlers/response.js';
import cors from 'cors';
import serverless from 'serverless-http';
import { feedbackHandler } from './handlers/feedback.js';

const app = express();
app.use(express.json());


const port = 3001;

app.use(cors({
  origin: '*',
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.post('/process', ...processHandler);

app.post('/feedback', feedbackHandler);

app.post('/response', responseHandler);
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


export const handler = serverless(app);