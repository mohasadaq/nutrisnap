export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  // Extended nutrients
  saturatedFat?: number; // in grams
  sugars?: number; // in grams
  calcium?: number; // in mg
  vitaminD?: number; // in IU or mcg
  vitaminB12?: number; // in mcg
  potassium?: number; // in mg
  phosphorus?: number; // in mg
  riboflavin?: number; // Vitamin B2, in mg
  sodium?: number; // in mg
}

export interface ScannedFoodItem extends NutritionInfo {
  foodIdentification: string;
  photoDataUri: string;
}

export interface LoggedMeal extends ScannedFoodItem {
  id: string; // Unique ID for the log entry
  timestamp: string; // ISO string
}
