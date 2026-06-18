const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;

export function splitIntoChunks(text: string): string[] {
  const cleanText = text.trim().replace(/\s+/g, ' ');

  if (cleanText.length <= CHUNK_SIZE) {
    return [cleanText];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < cleanText.length) {
    const end = Math.min(start + CHUNK_SIZE, cleanText.length);
    let chunk = cleanText.slice(start, end);

    // tenta quebrar no final da frase, em vez de ser no meio
    if (end < cleanText.length) {
      const lastPeriod = chunk.lastIndexOf('. ');
      if (lastPeriod > CHUNK_SIZE * 0.5) {
        chunk = chunk.slice(0, lastPeriod + 1);
      }
    }

    chunks.push(chunk.trim());
    start += chunk.length - CHUNK_OVERLAP;
  }

  return chunks.filter((c) => c.length > 0);
}