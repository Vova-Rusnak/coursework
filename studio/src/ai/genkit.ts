
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config } from 'dotenv';

config(); // Убедимся, что переменные из .env загружены

export const ai = genkit({
  plugins: [googleAI()], // googleAI() автоматически будет использовать process.env.GOOGLE_API_KEY или process.env.GOOGLE_GENAI_API_KEY
  model: 'googleai/gemini-2.0-flash',
});
