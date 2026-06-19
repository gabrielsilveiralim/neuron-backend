import { Router, Request, Response } from 'express';
import { askQuestion } from '../services/chatService.js';
import type { ChatRequestBody } from '../types/index.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as ChatRequestBody;

    if (!body.message) {
      return res.status(400).json({
        error: 'O campo "message" é obrigatório',
      });
    }

    const result = await askQuestion(body.message);

    res.status(200).json({
      answer: result.answer,
      sourcesUsed: result.sourcesUsed,
    });
  } catch (error) {
    console.error('Erro ao processar pergunta:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

export default router;