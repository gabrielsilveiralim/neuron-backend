import { supabase } from '../config/supabase';
import { genAI } from '../config/gemini';
import { generateEmbedding } from './voyage';

export async function askQuestion(message: string) {
    const queryEmbedding = await generateEmbedding(message, 'query');

    const { data: matches, error } = await supabase.rpc('match_embeddings', {
        query_embedding: queryEmbedding,
        match_count: 5,
    });

    if (error) {
        console.error('RPC error:', error);
        throw new Error(error.message);
    }

    const safeMatches = Array.isArray(matches) ? matches : [];

    const context = safeMatches
        .filter(m => m?.chunk_text)
        .map(m => m.chunk_text)
        .join('\n\n');

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
    });

    const hasContext = context && context.trim().length > 0;

    const prompt = `
    Você é o Neuron.
    O Neuron é um assistente pessoal de segundo cérebro com inteligência artificial.
    Ele usa um sistema de RAG (Retrieval-Augmented Generation) para buscar informações nas notas do usuário antes de responder.

    ## Regras principais:
    - Priorize SEMPRE o contexto abaixo se ele existir
    - Se não houver contexto, diga que não encontrou informações nas notas
    - Nunca invente que algo veio das notas se não estiver no contexto
    - Se precisar, complemente com conhecimento geral, mas deixe isso claro
    - Seja direto e útil

    ## Contexto das notas do usuário:
    ${hasContext ? context : "Nenhum contexto relevante encontrado nas notas do usuário."}

    ## Pergunta do usuário:
    ${message} `;

    const result = await model.generateContent(prompt);

    return {
        answer: result.response.text(),
        sourcesUsed: safeMatches.length,
    };
}