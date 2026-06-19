import { supabase } from '../config/supabase';
import { IngestRequestBody } from '../types';
import { splitIntoChunks } from './chunking';
import { generateEmbeddings } from './voyage';

export async function ingestDocument(body: IngestRequestBody) {
  const { content, title, source } = body;

  const { data: doc } = await supabase
    .from('documents')
    .insert({ content, title, source })
    .select()
    .single();

  const chunks = splitIntoChunks(content);

  const embeddings = await generateEmbeddings(chunks, 'document');

  const rows = chunks.map((chunk, i) => ({
    document_id: doc.id,
    chunk_text: chunk,
    embedding: embeddings[i],
  }));

  await supabase.from('embeddings').insert(rows);

  return {
    documentId: doc.id,
    chunksCreated: chunks.length,
  };
}