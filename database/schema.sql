
-- Neuron - Setup do banco no Supabase

-- Habilita a extensao pgvector para armazenar os embeddings
create extension if not exists vector;

-- Tabela de documentos notas/textos que alimenta o sistema
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  source text,            
  title text,
  created_at timestamptz default now()
);

-- Tabela de embeddings
create table if not exists embeddings (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  chunk_text text not null,
  embedding vector(1024) not null,
  created_at timestamptz default now()
);

-- Indice para acelerar a busca por similaridade
create index if not exists embeddings_vector_idx
  on embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- RPC chamada pelo backend
create or replace function match_embeddings (
  query_embedding vector(1024),
  match_threshold float default 0.5,
  match_count int default 5
)
returns table (
  id uuid,
  document_id uuid,
  chunk_text text,
  similarity float
)
language sql stable
as $$
  select
    embeddings.id,
    embeddings.document_id,
    embeddings.chunk_text,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  from embeddings
  where 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  order by embeddings.embedding <=> query_embedding
  limit match_count;
$$;