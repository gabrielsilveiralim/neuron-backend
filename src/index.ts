import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ingestRouter from './routes/ingest.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'neuron-backend' });
});

app.use('/ingest', ingestRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta:${PORT}`);
});