"use client";

import type { ScannedFoodItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Beef, Wheat, Droplet, Utensils, Percent, Sigma, Zap, Bone, Sun, Brain, Leaf, Activity } from 'lucide-react';
import Image from 'next/image';
import { useMealLog } from '@/hooks/use-meal-log';
import { useToast } from '@/hooks/use-toast';

interface NutritionDisplayCardProps {
  item: ScannedFoodItem;
}

const NutrientItem: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit: string; className?: string }> = ({ icon: Icon, label, value, unit, className }) => (
  <div className={cn("flex items-center justify-between py-2 border-b border-border last:border-b-0", className)}>
    <div className="flex items-center">
      <Icon className="h-5 w-5 mr-3 text-primary" />
      <span className="text-foreground font-medium">{label}</span>
    </div>
    <span className="text-foreground">{value} {unit}</span>
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

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl animate-in fade-in-50 duration-500">
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
      <CardContent className="space-y-1.5">
        <NutrientItem icon={Flame} label="Calories" value={Math.round(item.calories)} unit="kcal" />
        <NutrientItem icon={Beef} label="Protein" value={item.protein.toFixed(1)} unit="g" />
        <NutrientItem icon={Wheat} label="Carbohydrates" value={item.carbohydrates.toFixed(1)} unit="g" />
        {typeof item.sugars === 'number' && <NutrientItem icon={Percent} label="Sugars" value={item.sugars.toFixed(1)} unit="g" className="pl-6 text-sm"/>}
        <NutrientItem icon={Droplet} label="Fat" value={item.fat.toFixed(1)} unit="g" />
        {typeof item.saturatedFat === 'number' && <NutrientItem icon={Sigma} label="Saturated Fat" value={item.saturatedFat.toFixed(1)} unit="g" className="pl-6 text-sm"/>}
        
        {typeof item.calcium === 'number' && <NutrientItem icon={Bone} label="Calcium" value={item.calcium.toFixed(0)} unit="mg" />}
        {typeof item.vitaminD === 'number' && <NutrientItem icon={Sun} label="Vitamin D" value={item.vitaminD.toFixed(0)} unit="IU/mcg" />}
        {typeof item.vitaminB12 === 'number' && <NutrientItem icon={Brain} label="Vitamin B12" value={item.vitaminB12.toFixed(1)} unit="mcg" />}
        {typeof item.potassium === 'number' && <NutrientItem icon={Zap} label="Potassium" value={item.potassium.toFixed(0)} unit="mg" />}
        {typeof item.phosphorus === 'number' && <NutrientItem icon={Leaf} label="Phosphorus" value={item.phosphorus.toFixed(0)} unit="mg" />}
        {typeof item.riboflavin === 'number' && <NutrientItem icon={Activity} label="Riboflavin (B2)" value={item.riboflavin.toFixed(2)} unit="mg" />}
        {typeof item.sodium === 'number' && <NutrientItem icon={Sigma} label="Sodium" value={item.sodium.toFixed(0)} unit="mg" />}
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogMeal} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Log Meal
        </Button>
      </CardFooter>
    </Card>
  );
}
