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

const NutritionEstimationSchema = z.object({
  calories: z.number().describe('The calorie count.'),
  protein: z.number().describe('The protein amount in grams.'),
  carbohydrates: z.number().describe('The carbohydrate amount in grams.'),
  fat: z.number().describe('The fat amount in grams.'),
  saturatedFat: z.number().optional().describe('Saturated fat content in grams.'),
  sugars: z.number().optional().describe('Sugar content in grams.'),
  calcium: z.number().optional().describe('Calcium content in milligrams (mg).'),
  vitaminD: z.number().optional().describe('Vitamin D content in IU or mcg.'),
  vitaminB12: z.number().optional().describe('Vitamin B12 content in micrograms (mcg).'),
  potassium: z.number().optional().describe('Potassium content in milligrams (mg).'),
  phosphorus: z.number().optional().describe('Phosphorus content in milligrams (mg).'),
  riboflavin: z.number().optional().describe('Riboflavin (Vitamin B2) content in milligrams (mg).'),
  sodium: z.number().optional().describe('Sodium content in milligrams (mg).'),
});

const ImproveNutritionEstimationInputSchema = z.object({
  foodName: z.string().describe('The name of the food item.'),
  originalEstimation: NutritionEstimationSchema.describe('The original nutrition estimation provided to the user.'),
  userFeedback: NutritionEstimationSchema.partial().extend({
    comments: z.string().optional().describe('Any additional comments or context provided by the user about the food or estimation.'),
  }).describe('The feedback provided by the user on the nutrition estimation. User may provide feedback on any subset of nutrients.'),
});
export type ImproveNutritionEstimationInput = z.infer<typeof ImproveNutritionEstimationInputSchema>;

const ImproveNutritionEstimationOutputSchema = z.object({
  updatedEstimation: NutritionEstimationSchema.describe('The improved nutrition estimation based on user feedback.'),
  reasoning: z.string().describe('Explanation of the changes and factors considered when adjusting estimations, referencing specific nutrients that were adjusted.'),
});
export type ImproveNutritionEstimationOutput = z.infer<typeof ImproveNutritionEstimationOutputSchema>;

export async function improveNutritionEstimation(input: ImproveNutritionEstimationInput): Promise<ImproveNutritionEstimationOutput> {
  return improveNutritionEstimationFlow(input);
}

// Helper function to format nutrient details for the prompt
const formatNutrientDetails = (estimation: z.infer<typeof NutritionEstimationSchema>) => {
  let details = `Calories: ${estimation.calories}, Protein: ${estimation.protein}g, Carbohydrates: ${estimation.carbohydrates}g, Fat: ${estimation.fat}g`;
  if (estimation.saturatedFat !== undefined) details += `, Saturated Fat: ${estimation.saturatedFat}g`;
  if (estimation.sugars !== undefined) details += `, Sugars: ${estimation.sugars}g`;
  if (estimation.calcium !== undefined) details += `, Calcium: ${estimation.calcium}mg`;
  if (estimation.vitaminD !== undefined) details += `, Vitamin D: ${estimation.vitaminD} IU/mcg`;
  if (estimation.vitaminB12 !== undefined) details += `, Vitamin B12: ${estimation.vitaminB12}mcg`;
  if (estimation.potassium !== undefined) details += `, Potassium: ${estimation.potassium}mg`;
  if (estimation.phosphorus !== undefined) details += `, Phosphorus: ${estimation.phosphorus}mg`;
  if (estimation.riboflavin !== undefined) details += `, Riboflavin: ${estimation.riboflavin}mg`;
  if (estimation.sodium !== undefined) details += `, Sodium: ${estimation.sodium}mg`;
  return details;
};

const prompt = ai.definePrompt({
  name: 'improveNutritionEstimationPrompt',
  input: {schema: ImproveNutritionEstimationInputSchema},
  output: {schema: ImproveNutritionEstimationOutputSchema},
  prompt: `You are an AI assistant specializing in refining nutrition estimations for food items based on user feedback.
You will receive the original detailed nutrition estimation for a food item, along with feedback from a user.
Your goal is to provide an improved, comprehensive nutrition estimation, explaining your reasoning for any changes.

Food Item: {{{foodName}}}
Original Estimation: {{formatNutrientDetails originalEstimation}}
User Feedback:
  Calories: {{{userFeedback.calories}}}
  Protein: {{{userFeedback.protein}}}g
  Carbohydrates: {{{userFeedback.carbohydrates}}}g
  Fat: {{{userFeedback.fat}}}g
  Saturated Fat: {{{userFeedback.saturatedFat}}}g
  Sugars: {{{userFeedback.sugars}}}g
  Calcium: {{{userFeedback.calcium}}}mg
  Vitamin D: {{{userFeedback.vitaminD}}} IU/mcg
  Vitamin B12: {{{userFeedback.vitaminB12}}}mcg
  Potassium: {{{userFeedback.potassium}}}mg
  Phosphorus: {{{userFeedback.phosphorus}}}mg
  Riboflavin: {{{userFeedback.riboflavin}}}mg
  Sodium: {{{userFeedback.sodium}}}mg
  Comments: {{{userFeedback.comments}}}

Provide an updated nutrition estimation. This estimation should include values for ALL fields present in the 'NutritionEstimationSchema' (calories, protein, carbohydrates, fat, saturatedFat, sugars, calcium, vitaminD, vitaminB12, potassium, phosphorus, riboflavin, sodium).
If the user provided a value for a nutrient, prioritize that, but ensure it's reasonable. If the user did not provide a value for a specific nutrient, you should either keep the original value if it was accurate, or re-estimate it based on the food item and any related feedback.
Your reasoning should clearly state which nutrients were adjusted and why, considering the user's direct feedback and your nutritional knowledge. If a nutrient value remains unchanged, briefly state why it was considered accurate.
Ensure all values in 'updatedEstimation' are numbers. If a nutrient is not applicable or truly zero, use 0.
`,
  templateFormat: "handlebars",
  model: {
    helpers: {
      formatNutrientDetails: formatNutrientDetails
    }
  }
});

const improveNutritionEstimationFlow = ai.defineFlow(
  {
    name: 'improveNutritionEstimationFlow',
    inputSchema: ImproveNutritionEstimationInputSchema,
    outputSchema: ImproveNutritionEstimationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure all fields in updatedEstimation are present, defaulting to 0 if undefined from AI
    const defaultNutrients: Required<z.infer<typeof NutritionEstimationSchema>> = {
        calories: 0, protein: 0, carbohydrates: 0, fat: 0,
        saturatedFat: 0, sugars: 0, calcium: 0, vitaminD: 0,
        vitaminB12: 0, potassium: 0, phosphorus: 0, riboflavin: 0, sodium: 0
    };
    
    const finalOutput = {
        ...output,
        updatedEstimation: {
            ...defaultNutrients, // Provide defaults
            ...(output?.updatedEstimation || {}), // Spread AI output over defaults
        },
    };

    // Ensure required base nutrients are numbers, even if AI somehow misses them.
    finalOutput.updatedEstimation.calories = Number(finalOutput.updatedEstimation.calories) || 0;
    finalOutput.updatedEstimation.protein = Number(finalOutput.updatedEstimation.protein) || 0;
    finalOutput.updatedEstimation.carbohydrates = Number(finalOutput.updatedEstimation.carbohydrates) || 0;
    finalOutput.updatedEstimation.fat = Number(finalOutput.updatedEstimation.fat) || 0;
    
    return finalOutput as ImproveNutritionEstimationOutput;
  }
);
