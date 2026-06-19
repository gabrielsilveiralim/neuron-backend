import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import ingestRouter from './routes/ingest.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_, res) => {
  res.json({ ok: true });
});

app.use('/ingest', ingestRouter);
app.use('/chat', chatRouter);

app.listen(port, () => {
  console.log(`Neuron rodando na porta ${port}`);
});