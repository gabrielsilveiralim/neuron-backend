import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = 'voyage-3';

const apiKey = process.env.VOYAGE_API_KEY;

if (!apiKey) {
  throw new Error('VOYAGE_API_KEY precisa estar definida no .env');
}

interface VoyageResponse {
  data: { embedding: number[] }[];
}

/**
 * Gera embeddings para uma lista de textos usando a Voyage AI.
 * input_type 'document' é usado ao salvar conteúdo (ingest).
 * input_type 'query' é usado ao buscar embeddings 
 */
export async function generateEmbeddings(
  texts: string[],
  inputType: 'document' | 'query' = 'document'
): Promise<number[][]> {
  const response = await axios.post<VoyageResponse>(
    VOYAGE_API_URL,
    {
      input: texts,
      model: VOYAGE_MODEL,
      input_type: inputType,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data.map((item) => item.embedding);
}

/* Atalho para gerar o embedding de um único texto. */
export async function generateEmbedding(
  text: string,
  inputType: 'document' | 'query' = 'document'
): Promise<number[]> {
  const [embedding] = await generateEmbeddings([text], inputType);
  return embedding;
}