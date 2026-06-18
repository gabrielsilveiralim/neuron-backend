import { supabase } from '../config/supabase.js';
import { splitIntoChunks } from './chunking.js';
import { generateEmbeddings } from './voyage.js';
import type { IngestRequestBody } from '../types/index.js';

interface IngestResult {
  documentId: string;
  chunksCreated: number;
}

/* Recebe um texto, quebra em chunks, gera embeddings e salva tudo no Supabase */
export async function ingestDocument(
  body: IngestRequestBody
): Promise<IngestResult> {
  const { content, title, source } = body;

  if (!content || content.trim().length === 0) {
    throw new Error('O campo "content" não pode estar vazio');
  }

  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert({
      content,
      title: title ?? null,
      source: source ?? 'manual',
    })
    .select()
    .single();

  if (docError || !document) {
    throw new Error(`Erro ao salvar documento: ${docError?.message}`);
  }

  const chunks = splitIntoChunks(content);

  const embeddings = await generateEmbeddings(chunks, 'document');

  const embeddingRows = chunks.map((chunkText, i) => ({
    document_id: document.id,
    chunk_text: chunkText,
    embedding: embeddings[i],
  }));

  const { error: embError } = await supabase
    .from('embeddings')
    .insert(embeddingRows);

  if (embError) {
    throw new Error(`Erro ao salvar embeddings: ${embError.message}`);
  }

  return {
    documentId: document.id,
    chunksCreated: chunks.length,
  };
}