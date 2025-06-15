'use server';
/**
 * @fileOverview An AI agent that scans a food item and provides its nutritional content.
 *
 * - scanFoodAndAnalyzeNutrition - A function that handles the food scanning and nutritional analysis process.
 * - ScanFoodAndAnalyzeNutritionInput - The input type for the scanFoodAndAnalyzeNutrition function.
 * - ScanFoodAndAnalyzeNutritionOutput - The return type for the scanFoodAndAnalyzeNutrition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanFoodAndAnalyzeNutritionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanFoodAndAnalyzeNutritionInput = z.infer<typeof ScanFoodAndAnalyzeNutritionInputSchema>;

const ScanFoodAndAnalyzeNutritionOutputSchema = z.object({
  foodIdentification: z
    .string()
    .describe('The identified food item from the image.'),
  nutritionAnalysis: z.object({
    calories: z.number().describe('Estimated calories in the food item.'),
    protein: z.number().describe('Estimated protein content in grams.'),
    carbohydrates: z.number().describe('Estimated carbohydrate content in grams.'),
    fat: z.number().describe('Estimated fat content in grams.'),
  }).describe('Nutritional information for the identified food item.'),
});
export type ScanFoodAndAnalyzeNutritionOutput = z.infer<typeof ScanFoodAndAnalyzeNutritionOutputSchema>;

export async function scanFoodAndAnalyzeNutrition(input: ScanFoodAndAnalyzeNutritionInput): Promise<ScanFoodAndAnalyzeNutritionOutput> {
  return scanFoodAndAnalyzeNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanFoodAndAnalyzeNutritionPrompt',
  input: {schema: ScanFoodAndAnalyzeNutritionInputSchema},
  output: {schema: ScanFoodAndAnalyzeNutritionOutputSchema},
  prompt: `You are a nutritional expert. You will identify the food item in the image and provide an estimate of its nutritional content, including calories, protein, carbohydrates, and fat.

Use the following image to identify the food item and estimate its nutritional content:

Food Image: {{media url=photoDataUri}}

Provide the food identification and nutritional analysis in the following JSON format:

{ "foodIdentification": "Identified food item", "nutritionAnalysis": { "calories": 0, "protein": 0, "carbohydrates": 0, "fat": 0 } }`,
});

const scanFoodAndAnalyzeNutritionFlow = ai.defineFlow(
  {
    name: 'scanFoodAndAnalyzeNutritionFlow',
    inputSchema: ScanFoodAndAnalyzeNutritionInputSchema,
    outputSchema: ScanFoodAndAnalyzeNutritionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
