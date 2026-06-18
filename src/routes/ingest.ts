import { Router, Request, Response } from 'express';
import { ingestDocument } from '../services/ingestService.js';
import type { IngestRequestBody } from '../types/index.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as IngestRequestBody;

    if (!body.content) {
      return res.status(400).json({
        error: 'O campo "content" é obrigatório',
      });
    }

    const result = await ingestDocument(body);

    res.status(201).json({
      message: 'Documento processado com sucesso',
      documentId: result.documentId,
      chunksCreated: result.chunksCreated,
    });
  } catch (error) {
    console.error('Erro ao ingerir documento:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

export default router;