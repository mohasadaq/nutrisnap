
"use client";

import type { ScannedFoodItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Beef, Wheat, Droplet, Utensils, Percent, Sigma, Zap, Bone, Sun, Brain, Leaf, Activity } from 'lucide-react';
import Image from 'next/image';
import { useMealLog } from '@/hooks/use-meal-log';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface NutritionDisplayCardProps {
  item: ScannedFoodItem;
}

const NutrientItem: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit: string; className?: string; isSubItem?: boolean }> = ({ icon: Icon, label, value, unit, className, isSubItem }) => (
  <div className={cn("flex items-center justify-between py-2 border-b border-border last:border-b-0", className, isSubItem ? "pl-6" : "")}>
    <div className="flex items-center">
      <Icon className={cn("h-5 w-5 mr-3 text-primary", isSubItem ? "h-4 w-4" : "")} />
      <span className={cn("font-medium", isSubItem ? "text-sm text-muted-foreground" : "text-foreground")}>{label}</span>
    </div>
    <span className={cn(isSubItem ? "text-sm text-muted-foreground" : "text-foreground")}>{value} {unit}</span>
  </div>
);

export default function NutritionDisplayCard({ item }: NutritionDisplayCardProps) {
  const { addMeal } = useMealLog();
  const { toast } = useToast();

  const handleLogMeal = () => {
    addMeal(item);
    toast({
      title: "Meal Logged!",
      description: `${item.foodIdentification} has been added to your log.`,
    });
  };

  const mainNutrients = [
    { key: 'calories', icon: Flame, label: 'Calories', value: Math.round(item.calories), unit: 'kcal' },
    { key: 'protein', icon: Beef, label: 'Protein', value: item.protein.toFixed(1), unit: 'g' },
    { key: 'carbohydrates', icon: Wheat, label: 'Carbohydrates', value: item.carbohydrates.toFixed(1), unit: 'g' },
    { key: 'sugars', icon: Percent, label: 'Sugars', value: item.sugars, unit: 'g', isSubItem: true, parent: 'carbohydrates' },
    { key: 'fat', icon: Droplet, label: 'Fat', value: item.fat.toFixed(1), unit: 'g' },
    { key: 'saturatedFat', icon: Sigma, label: 'Saturated Fat', value: item.saturatedFat, unit: 'g', isSubItem: true, parent: 'fat' },
  ];

  const additionalNutrients = [
    { key: 'calcium', icon: Bone, label: 'Calcium', value: item.calcium, unit: 'mg' },
    { key: 'vitaminD', icon: Sun, label: 'Vitamin D', value: item.vitaminD, unit: 'IU/mcg' },
    { key: 'vitaminB12', icon: Brain, label: 'Vitamin B12', value: item.vitaminB12, unit: 'mcg' },
    { key: 'potassium', icon: Zap, label: 'Potassium', value: item.potassium, unit: 'mg' },
    { key: 'phosphorus', icon: Leaf, label: 'Phosphorus', value: item.phosphorus, unit: 'mg' },
    { key: 'riboflavin', icon: Activity, label: 'Riboflavin (B2)', value: item.riboflavin, unit: 'mg' },
    { key: 'sodium', icon: Sigma, label: 'Sodium', value: item.sodium, unit: 'mg' },
  ].filter(nutrient => typeof nutrient.value === 'number');


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl animate-in fade-in-50 duration-500">
      <CardHeader className="items-center text-center">
        {item.photoDataUri && (
          <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden">
            <Image
              src={item.photoDataUri}
              alt={item.foodIdentification}
              layout="fill"
              objectFit="cover"
              data-ai-hint="food item"
            />
          </div>
        )}
        <CardTitle className="text-2xl font-headline text-primary">{item.foodIdentification}</CardTitle>
        <CardDescription className="flex items-center justify-center text-muted-foreground">
          <Utensils className="h-4 w-4 mr-1" />
          <span>Nutritional Information</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-0.5"> {/* Adjusted space-y slightly */}
        {mainNutrients.map(nutrient => {
          if (nutrient.isSubItem) {
            // Render sub-item only if its parent is present and its own value is a number
            const parentValue = item[nutrient.parent as keyof ScannedFoodItem];
            if (typeof parentValue === 'number' && typeof nutrient.value === 'number') {
              return <NutrientItem key={nutrient.key} icon={nutrient.icon} label={nutrient.label} value={nutrient.value.toFixed(nutrient.unit === 'g' || nutrient.unit === 'mcg' || nutrient.unit === 'mg' ? 1 : 0)} unit={nutrient.unit} isSubItem={true} />;
            }
            return null;
          }
          // Render main item
          return <NutrientItem key={nutrient.key} icon={nutrient.icon} label={nutrient.label} value={nutrient.value as (string | number)} unit={nutrient.unit} />;
        })}
        
        {additionalNutrients.length > 0 && (
          <>
            <Separator className="my-3" />
            {additionalNutrients.map(nutrient => (
              <NutrientItem key={nutrient.key} icon={nutrient.icon} label={nutrient.label} value={nutrient.value!.toFixed(nutrient.unit === 'g' || nutrient.unit === 'mcg' || nutrient.unit === 'mg' ? (nutrient.key === 'riboflavin' ? 2:1) : 0)} unit={nutrient.unit} />
            ))}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogMeal} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Log Meal
        </Button>
      </CardFooter>
    </Card>
  );
}

