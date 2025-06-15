'use server';
/**
 * @fileOverview A flow to improve nutrition estimation based on user feedback.
 *
 * - improveNutritionEstimation - A function that handles the process of improving nutrition estimation with feedback.
 * - ImproveNutritionEstimationInput - The input type for the improveNutritionEstimation function.
 * - ImproveNutritionEstimationOutput - The return type for the improveNutritionEstimation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveNutritionEstimationInputSchema = z.object({
  foodName: z.string().describe('The name of the food item.'),
  originalEstimation: z.object({
    calories: z.number().describe('The original estimated calorie count.'),
    protein: z.number().describe('The original estimated protein amount in grams.'),
    carbohydrates: z.number().describe('The original estimated carbohydrate amount in grams.'),
    fat: z.number().describe('The original estimated fat amount in grams.'),
  }).describe('The original nutrition estimation provided to the user.'),
  userFeedback: z.object({
    calories: z.number().optional().describe('The user-provided calorie count, if different from the original estimation.'),
    protein: z.number().optional().describe('The user-provided protein amount in grams, if different from the original estimation.'),
    carbohydrates: z.number().optional().describe('The user-provided carbohydrate amount in grams, if different from the original estimation.'),
    fat: z.number().optional().describe('The user-provided fat amount in grams, if different from the original estimation.'),
    comments: z.string().optional().describe('Any additional comments or context provided by the user about the food or estimation.'),
  }).describe('The feedback provided by the user on the nutrition estimation.'),
});
export type ImproveNutritionEstimationInput = z.infer<typeof ImproveNutritionEstimationInputSchema>;

const ImproveNutritionEstimationOutputSchema = z.object({
  updatedEstimation: z.object({
    calories: z.number().describe('The updated calorie count based on user feedback.'),
    protein: z.number().describe('The updated protein amount in grams based on user feedback.'),
    carbohydrates: z.number().describe('The updated carbohydrate amount in grams based on user feedback.'),
    fat: z.number().describe('The updated fat amount in grams based on user feedback.'),
  }).describe('The improved nutrition estimation.'),
  reasoning: z.string().describe('Explanation of the changes and factors considered when adjusting estimations.'),
});
export type ImproveNutritionEstimationOutput = z.infer<typeof ImproveNutritionEstimationOutputSchema>;

export async function improveNutritionEstimation(input: ImproveNutritionEstimationInput): Promise<ImproveNutritionEstimationOutput> {
  return improveNutritionEstimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveNutritionEstimationPrompt',
  input: {schema: ImproveNutritionEstimationInputSchema},
  output: {schema: ImproveNutritionEstimationOutputSchema},
  prompt: `You are an AI assistant specializing in refining nutrition estimations for food items based on user feedback.

You will receive the original nutrition estimation for a food item, along with feedback from a user who has consumed the item.
Your goal is to provide an improved nutrition estimation, explaining your reasoning for the changes.

Food Item: {{{foodName}}}
Original Estimation: Calories: {{{originalEstimation.calories}}}, Protein: {{{originalEstimation.protein}}}g, Carbohydrates: {{{originalEstimation.carbohydrates}}}g, Fat: {{{originalEstimation.fat}}}g
User Feedback: Calories: {{{userFeedback.calories}}}, Protein: {{{userFeedback.protein}}}g, Carbohydrates: {{{userFeedback.carbohydrates}}}g, Fat: {{{userFeedback.fat}}}g, Comments: {{{userFeedback.comments}}}

Provide an updated nutrition estimation with updated values for calories, protein, carbohydrates, and fat based on the user feedback, and include reasoning for changes.
Ensure that the updated estimation is based on your knowledge of similar food items, nutritional databases, and the user's comments.
If the user provides new information or context in the comments, consider it when adjusting the estimations.
`,
});

const improveNutritionEstimationFlow = ai.defineFlow(
  {
    name: 'improveNutritionEstimationFlow',
    inputSchema: ImproveNutritionEstimationInputSchema,
    outputSchema: ImproveNutritionEstimationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
