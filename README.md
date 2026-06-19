# Neuron Backend 🧠

API do projeto Neuron, um sistema de segundo cérebro com IA baseado em RAG (Retrieval-Augmented Generation).
Essa API permite salvar textos, gerar embeddings e consultar esses dados usando IA generativa.

## O que é o Neuron Backend

O Neuron Backend é responsável por:
- Receber e armazenar textos (notas do usuário)
- Dividir textos em chunks
- Gerar embeddings com Voyage AI
- Armazenar embeddings no Supabase (pgvector)
- Buscar contexto relevante por similaridade
- Enviar contexto para o Gemini gerar respostas

## Base URL (produção)
https://neuron-backend.up.railway.app

## Endpoints

### Ingestar documento
Salva um texto e cria embeddings.
POST `/ingest`
#### Body:
{
  "content": "O Neuron é um projeto de segundo cérebro com IA.",
  "title": "Sobre o Neuron",
  "source": "manual"
}

### Chat com IA
Consulta o sistema usando RAG.
POST `/chat`
#### Body:
{
  "message": "O que é o projeto Neuron ?"
}
