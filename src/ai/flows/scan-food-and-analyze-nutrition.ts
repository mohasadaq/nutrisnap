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

const NutritionAnalysisSchema = z.object({
  calories: z.number().describe('Estimated calories in the food item.'),
  protein: z.number().describe('Estimated protein content in grams.'),
  carbohydrates: z.number().describe('Estimated carbohydrate content in grams.'),
  fat: z.number().describe('Estimated fat content in grams.'),
  saturatedFat: z.number().optional().describe('Estimated saturated fat content in grams.'),
  sugars: z.number().optional().describe('Estimated sugar content in grams (part of carbohydrates).'),
  calcium: z.number().optional().describe('Estimated calcium content in milligrams (mg).'),
  vitaminD: z.number().optional().describe('Estimated Vitamin D content in International Units (IU) or micrograms (mcg). Specify unit in reasoning if possible.'),
  vitaminB12: z.number().optional().describe('Estimated Vitamin B12 content in micrograms (mcg).'),
  potassium: z.number().optional().describe('Estimated potassium content in milligrams (mg).'),
  phosphorus: z.number().optional().describe('Estimated phosphorus content in milligrams (mg).'),
  riboflavin: z.number().optional().describe('Estimated Riboflavin (Vitamin B2) content in milligrams (mg).'),
  sodium: z.number().optional().describe('Estimated sodium content in milligrams (mg).'),
});

const ScanFoodAndAnalyzeNutritionOutputSchema = z.object({
  foodIdentification: z
    .string()
    .describe('The identified food item from the image.'),
  nutritionAnalysis: NutritionAnalysisSchema.describe('Nutritional information for the identified food item, including micronutrients if available, especially for items like milk.'),
});
export type ScanFoodAndAnalyzeNutritionOutput = z.infer<typeof ScanFoodAndAnalyzeNutritionOutputSchema>;

export async function scanFoodAndAnalyzeNutrition(input: ScanFoodAndAnalyzeNutritionInput): Promise<ScanFoodAndAnalyzeNutritionOutput> {
  return scanFoodAndAnalyzeNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanFoodAndAnalyzeNutritionPrompt',
  input: {schema: ScanFoodAndAnalyzeNutritionInputSchema},
  output: {schema: ScanFoodAndAnalyzeNutritionOutputSchema},
  config: {
    temperature: 0.1, // Lowered temperature for more deterministic output
  },
  prompt: `You are a nutritional expert. You will identify the food item in the image and provide an estimate of its nutritional content.
Focus on providing calories, protein, carbohydrates, and total fat.
Additionally, if the item appears to be milk or a dairy product, provide estimates for: saturated fat (g), sugars (g), calcium (mg), Vitamin D (IU or mcg), Vitamin B12 (mcg), potassium (mg), phosphorus (mg), riboflavin (mg), and sodium (mg). For other food items, include these additional nutrients if readily available and commonly tracked for that item.

Use the following image to identify the food item and estimate its nutritional content:

Food Image: {{media url=photoDataUri}}

Provide the food identification and nutritional analysis in the specified JSON output format. Ensure all numerical values are numbers, not strings.
You MUST provide a value for EVERY field defined in the 'ScanFoodAndAnalyzeNutritionOutputSchema.nutritionAnalysis' object (calories, protein, carbohydrates, fat, saturatedFat, sugars, calcium, vitaminD, vitaminB12, potassium, phosphorus, riboflavin, sodium).
If a specific nutrient is not applicable for the identified food item, or if the data is genuinely unavailable, use the value 0 for that nutrient. Do not omit fields.

Example for milk:
{
  "foodIdentification": "Whole Milk",
  "nutritionAnalysis": {
    "calories": 150,
    "protein": 8,
    "carbohydrates": 12,
    "fat": 8,
    "saturatedFat": 5,
    "sugars": 12,
    "calcium": 300,
    "vitaminD": 100,
    "vitaminB12": 1.2,
    "potassium": 380,
    "phosphorus": 250,
    "riboflavin": 0.4,
    "sodium": 120
  }
}
Example for a non-dairy item where extended nutrients might not be primary:
{
  "foodIdentification": "Apple",
  "nutritionAnalysis": {
    "calories": 95,
    "protein": 0.5,
    "carbohydrates": 25,
    "fat": 0.3,
    "sugars": 19,
    "saturatedFat": 0,
    "calcium": 6,
    "vitaminD": 0,
    "vitaminB12": 0,
    "potassium": 107,
    "phosphorus": 11,
    "riboflavin": 0.03,
    "sodium": 1
  }
}
`,
});

const scanFoodAndAnalyzeNutritionFlow = ai.defineFlow(
  {
    name: 'scanFoodAndAnalyzeNutritionFlow',
    inputSchema: ScanFoodAndAnalyzeNutritionInputSchema,
    outputSchema: ScanFoodAndAnalyzeNutritionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    // Define a default structure for nutritionAnalysis ensuring all fields are present.
    const defaultNutritionAnalysisData = {
        calories: 0, protein: 0, carbohydrates: 0, fat: 0,
        saturatedFat: 0, sugars: 0, calcium: 0, vitaminD: 0,
        vitaminB12: 0, potassium: 0, phosphorus: 0, riboflavin: 0, sodium: 0
    };

    const analysisFromAI = output?.nutritionAnalysis || {};
    const mergedAnalysis = { ...defaultNutritionAnalysisData, ...analysisFromAI };

    // Coerce all nutrient values to numbers, defaulting to 0 if NaN or undefined.
    const finalNutritionAnalysis = {
        calories: Number(mergedAnalysis.calories) || 0,
        protein: Number(mergedAnalysis.protein) || 0,
        carbohydrates: Number(mergedAnalysis.carbohydrates) || 0,
        fat: Number(mergedAnalysis.fat) || 0,
        saturatedFat: Number(mergedAnalysis.saturatedFat) || 0,
        sugars: Number(mergedAnalysis.sugars) || 0,
        calcium: Number(mergedAnalysis.calcium) || 0,
        vitaminD: Number(mergedAnalysis.vitaminD) || 0,
        vitaminB12: Number(mergedAnalysis.vitaminB12) || 0,
        potassium: Number(mergedAnalysis.potassium) || 0,
        phosphorus: Number(mergedAnalysis.phosphorus) || 0,
        riboflavin: Number(mergedAnalysis.riboflavin) || 0,
        sodium: Number(mergedAnalysis.sodium) || 0,
    };
    
    const finalOutput: ScanFoodAndAnalyzeNutritionOutput = {
        foodIdentification: output?.foodIdentification || "Unknown Food",
        nutritionAnalysis: finalNutritionAnalysis,
    };

    return finalOutput;
  }
);
