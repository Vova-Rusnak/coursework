
'use server';
/**
 * @fileOverview AI-агент для діагностики захворювань на основі зображення.
 *
 * - diagnoseImage - Функція, що обробляє процес діагностики зображення.
 * - DiagnoseImageInput - Вхідний тип для функції diagnoseImage.
 * - DiagnoseImageOutput - Тип, що повертається функцією diagnoseImage.
 */

import {ai}from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Фото ураженої ділянки, як URI даних, що має містити MIME-тип та використовувати кодування Base64. Очікуваний формат: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseImageInput = z.infer<typeof DiagnoseImageInputSchema>;

const DiagnoseImageOutputSchema = z.object({
  possibleDiseases: z
    .array(z.string())
    .describe('Список з 2-3 найбільш ймовірних можливих захворювань на основі аналізу зображення, українською мовою.'),
});
export type DiagnoseImageOutput = z.infer<typeof DiagnoseImageOutputSchema>;

export async function diagnoseImage(input: DiagnoseImageInput): Promise<DiagnoseImageOutput> {
  return diagnoseImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseImagePrompt',
  input: {schema: DiagnoseImageInputSchema},
  output: {schema: DiagnoseImageOutputSchema},
  prompt: `Ви медичний ШІ-агент, що спеціалізується на діагностиці захворювань за зображеннями.

  Проаналізуйте зображення та надайте список з 2-3 найбільш ймовірних можливих захворювань, **українською мовою**.

  Зображення: {{media url=photoDataUri}}`,
});

const diagnoseImageFlow = ai.defineFlow(
  {
    name: 'diagnoseImageFlow',
    inputSchema: DiagnoseImageInputSchema,
    outputSchema: DiagnoseImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
