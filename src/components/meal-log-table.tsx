
"use client";

import type { LoggedMeal } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';
import { 
  Flame, 
  Beef, 
  Wheat, 
  Droplet, 
  CalendarDays, 
  Utensils, 
  Bone, 
  Sun,
  Percent,
  Sigma,
  Zap,
  Leaf,
  Brain,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MealLogTableProps {
  meals: LoggedMeal[];
  onClearLog: () => void; // Retained for consistency, though clear button is in parent
}

const NutrientRow: React.FC<{ icon: React.ElementType; label: string; value: string | number | undefined; unit: string; className?: string; isSubItem?: boolean }> = ({ icon: Icon, label, value, unit, className, isSubItem }) => {
  if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
    return null; // Don't render if value is not available
  }
  const displayValue = typeof value === 'number' ? (
    Number.isInteger(value) || unit === 'mg' || unit === 'IU/mcg' || unit === 'mcg' ? value.toFixed(0) : value.toFixed(1)
  ) : value;
  
  if (label === 'Riboflavin (B2)' && typeof value === 'number') {
    // Special case for Riboflavin to show 2 decimal places
     const riboValue = value.toFixed(2);
     return (
        <div className={cn("flex items-center justify-between py-1.5 text-sm", className, isSubItem ? "pl-6" : "")}>
            <div className="flex items-center">
            <Icon className={cn("h-4 w-4 mr-2 text-primary", isSubItem ? "h-3 w-3" : "")} />
            <span className={cn(isSubItem ? "text-xs text-muted-foreground" : "text-foreground")}>{label}</span>
            </div>
            <span className={cn(isSubItem ? "text-xs text-muted-foreground" : "text-foreground")}>{riboValue} {unit}</span>
        </div>
     );
  }


  return (
    <div className={cn("flex items-center justify-between py-1.5 text-sm", className, isSubItem ? "pl-6" : "")}>
      <div className="flex items-center">
        <Icon className={cn("h-4 w-4 mr-2 text-primary", isSubItem ? "h-3 w-3" : "")} />
        <span className={cn(isSubItem ? "text-xs text-muted-foreground" : "text-foreground")}>{label}</span>
      </div>
      <span className={cn(isSubItem ? "text-xs text-muted-foreground" : "text-foreground")}>{displayValue} {unit}</span>
    </div>
  );
};


export default function MealLogTable({ meals }: MealLogTableProps) {
  if (meals.length === 0) {
    return (
      <div className="text-center py-10">
        <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl font-semibold text-foreground">Your meal log is empty.</p>
        <p className="text-muted-foreground">Scan some food to start tracking your intake!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {meals.map((meal) => (
        <Card key={meal.id} className="shadow-lg overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={meal.photoDataUri || "https://placehold.co/600x400.png"}
                alt={meal.foodIdentification}
                layout="fill"
                objectFit="cover"
                data-ai-hint="logged food item"
              />
            </div>
            <div className="p-4">
              <CardTitle className="text-xl font-headline text-primary">{meal.foodIdentification}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground flex items-center mt-1">
                <CalendarDays className="h-3 w-3 mr-1.5" />
                {format(new Date(meal.timestamp), "MMM d, yyyy 'at' hh:mm a")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-1">
            <NutrientRow icon={Flame} label="Calories" value={meal.calories} unit="kcal" />
            <NutrientRow icon={Beef} label="Protein" value={meal.protein} unit="g" />
            <NutrientRow icon={Wheat} label="Carbohydrates" value={meal.carbohydrates} unit="g" />
            {meal.sugars !== undefined && <NutrientRow icon={Percent} label="Sugars" value={meal.sugars} unit="g" isSubItem />}
            <NutrientRow icon={Droplet} label="Fat" value={meal.fat} unit="g" />
            {meal.saturatedFat !== undefined && <NutrientRow icon={Sigma} label="Saturated Fat" value={meal.saturatedFat} unit="g" isSubItem />}
            
            {(meal.calcium !== undefined && meal.calcium > 0) || 
             (meal.vitaminD !== undefined && meal.vitaminD > 0) ||
             (meal.vitaminB12 !== undefined && meal.vitaminB12 > 0) ||
             (meal.potassium !== undefined && meal.potassium > 0) ||
             (meal.phosphorus !== undefined && meal.phosphorus > 0) ||
             (meal.riboflavin !== undefined && meal.riboflavin > 0) ||
             (meal.sodium !== undefined && meal.sodium > 0) ? (
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-foreground mb-1">Additional Nutrients:</h4>
                <NutrientRow icon={Bone} label="Calcium" value={meal.calcium} unit="mg" />
                <NutrientRow icon={Sun} label="Vitamin D" value={meal.vitaminD} unit="IU/mcg" />
                <NutrientRow icon={Brain} label="Vitamin B12" value={meal.vitaminB12} unit="mcg" />
                <NutrientRow icon={Zap} label="Potassium" value={meal.potassium} unit="mg" />
                <NutrientRow icon={Leaf} label="Phosphorus" value={meal.phosphorus} unit="mg" />
                <NutrientRow icon={Activity} label="Riboflavin (B2)" value={meal.riboflavin} unit="mg" />
                <NutrientRow icon={Sigma} label="Sodium" value={meal.sodium} unit="mg" />
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

