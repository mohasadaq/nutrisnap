export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface ScannedFoodItem extends NutritionInfo {
  foodIdentification: string;
  photoDataUri: string; // Changed to non-optional as it's key for logging and AI
}

export interface LoggedMeal extends ScannedFoodItem {
  id: string; // Unique ID for the log entry
  timestamp: string; // ISO string
}
