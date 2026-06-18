export interface Document {
  id: string;
  content: string;
  source: string | null;
  title: string | null;
  created_at: string;
}

export interface EmbeddingMatch {
  id: string;
  document_id: string;
  chunk_text: string;
  similarity: number;
}

export interface IngestRequestBody {
  content: string;
  title?: string;
  source?: string;
}

export interface ChatRequestBody {
  message: string;
}