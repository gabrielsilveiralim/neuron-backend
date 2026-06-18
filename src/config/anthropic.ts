import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY precisa estar definida no .env');
}

export const anthropic = new Anthropic({ apiKey });