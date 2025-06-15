"use client";

import type { ScannedFoodItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Beef, Wheat, Droplet, Utensils } from 'lucide-react';
import Image from 'next/image';
import { useMealLog } from '@/hooks/use-meal-log';
import { useToast } from '@/hooks/use-toast';

interface NutritionDisplayCardProps {
  item: ScannedFoodItem;
}

const NutrientItem: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit: string }> = ({ icon: Icon, label, value, unit }) => (
  <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
    <div className="flex items-center">
      <Icon className="h-6 w-6 mr-3 text-primary" />
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
      <CardContent className="space-y-2">
        <NutrientItem icon={Flame} label="Calories" value={Math.round(item.calories)} unit="kcal" />
        <NutrientItem icon={Beef} label="Protein" value={item.protein.toFixed(1)} unit="g" />
        <NutrientItem icon={Wheat} label="Carbohydrates" value={item.carbohydrates.toFixed(1)} unit="g" />
        <NutrientItem icon={Droplet} label="Fat" value={item.fat.toFixed(1)} unit="g" />
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogMeal} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Log Meal
        </Button>
      </CardFooter>
    </Card>
  );
}
