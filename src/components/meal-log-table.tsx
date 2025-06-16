
"use client";

import type { LoggedMeal } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
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
  Sigma, // Can be used for Saturated Fat and Sodium
  Zap,   // For Potassium
  Leaf,  // For Phosphorus
  Brain, // For Vitamin B12
  Activity // For Riboflavin
} from 'lucide-react';

interface MealLogTableProps {
  meals: LoggedMeal[];
  onClearLog: () => void; // Retain this prop even if button is in parent, for potential future use
}

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
      <Table className="bg-card shadow-md rounded-lg">
        <TableCaption>A list of your logged meals with key nutritional details.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] sm:w-[80px] sticky left-0 bg-card z-10">Image</TableHead>
            <TableHead className="sticky left-[60px] sm:left-[80px] bg-card z-10 min-w-[120px]">Food</TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end">
                <Flame className="h-4 w-4 mr-1 text-primary" /> <span className="hidden sm:inline">Calories (kcal)</span><span className="sm:hidden">Cal</span>
              </div>
            </TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              <div className="flex items-center justify-end">
                <Beef className="h-4 w-4 mr-1 text-primary" /> Prot (g)
              </div>
            </TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              <div className="flex items-center justify-end">
                <Wheat className="h-4 w-4 mr-1 text-primary" /> Carbs (g)
              </div>
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              <div className="flex items-center justify-end">
                <Percent className="h-4 w-4 mr-1 text-primary" /> Sugars (g)
              </div>
            </TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              <div className="flex items-center justify-end">
                <Droplet className="h-4 w-4 mr-1 text-primary" /> Fat (g)
              </div>
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              <div className="flex items-center justify-end">
                <Sigma className="h-4 w-4 mr-1 text-primary" /> Sat. Fat (g)
              </div>
            </TableHead>
            <TableHead className="text-right hidden lg:table-cell">
              <div className="flex items-center justify-end">
                <Sigma className="h-4 w-4 mr-1 text-primary" /> Sodium (mg)
              </div>
            </TableHead>
            <TableHead className="text-right hidden lg:table-cell">
              <div className="flex items-center justify-end">
                <Bone className="h-4 w-4 mr-1 text-primary" /> Calcium (mg)
              </div>
            </TableHead>
            <TableHead className="text-right hidden lg:table-cell">
              <div className="flex items-center justify-end">
                <Zap className="h-4 w-4 mr-1 text-primary" /> Potassium (mg)
              </div>
            </TableHead>
             <TableHead className="text-right hidden lg:table-cell">
              <div className="flex items-center justify-end">
                <Sun className="h-4 w-4 mr-1 text-primary" /> Vit. D (IU/mcg)
              </div>
            </TableHead>
            <TableHead className="text-right hidden xl:table-cell">
              <div className="flex items-center justify-end">
                <Leaf className="h-4 w-4 mr-1 text-primary" /> Phosphorus (mg)
              </div>
            </TableHead>
            <TableHead className="text-right hidden xl:table-cell">
              <div className="flex items-center justify-end">
                <Brain className="h-4 w-4 mr-1 text-primary" /> Vit. B12 (mcg)
              </div>
            </TableHead>
            <TableHead className="text-right hidden xl:table-cell">
              <div className="flex items-center justify-end">
                <Activity className="h-4 w-4 mr-1 text-primary" /> Riboflavin (mg)
              </div>
            </TableHead>
            <TableHead className="text-right">
             <div className="flex items-center justify-end">
                <CalendarDays className="h-4 w-4 mr-1 text-primary" /> <span className="hidden sm:inline">Date</span><span className="sm:hidden">Logged</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals.map((meal) => (
            <TableRow key={meal.id}>
              <TableCell className="sticky left-0 bg-card z-10">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-md overflow-hidden">
                  <Image
                    src={meal.photoDataUri || "https://placehold.co/64x64.png"}
                    alt={meal.foodIdentification}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="logged food"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium sticky left-[60px] sm:left-[80px] bg-card z-10">{meal.foodIdentification}</TableCell>
              <TableCell className="text-right">{Math.round(meal.calories)}</TableCell>
              <TableCell className="text-right hidden sm:table-cell">{meal.protein.toFixed(1)}</TableCell>
              <TableCell className="text-right hidden sm:table-cell">{meal.carbohydrates.toFixed(1)}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{typeof meal.sugars === 'number' ? meal.sugars.toFixed(1) : '-'}</TableCell>
              <TableCell className="text-right hidden sm:table-cell">{meal.fat.toFixed(1)}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{typeof meal.saturatedFat === 'number' ? meal.saturatedFat.toFixed(1) : '-'}</TableCell>
              <TableCell className="text-right hidden lg:table-cell">{typeof meal.sodium === 'number' ? meal.sodium.toFixed(0) : '-'}</TableCell>
              <TableCell className="text-right hidden lg:table-cell">{typeof meal.calcium === 'number' ? meal.calcium.toFixed(0) : '-'}</TableCell>
              <TableCell className="text-right hidden lg:table-cell">{typeof meal.potassium === 'number' ? meal.potassium.toFixed(0) : '-'}</TableCell>
              <TableCell className="text-right hidden lg:table-cell">{typeof meal.vitaminD === 'number' ? meal.vitaminD.toFixed(0) : '-'}</TableCell>
              <TableCell className="text-right hidden xl:table-cell">{typeof meal.phosphorus === 'number' ? meal.phosphorus.toFixed(0) : '-'}</TableCell>
              <TableCell className="text-right hidden xl:table-cell">{typeof meal.vitaminB12 === 'number' ? meal.vitaminB12.toFixed(1) : '-'}</TableCell>
              <TableCell className="text-right hidden xl:table-cell">{typeof meal.riboflavin === 'number' ? meal.riboflavin.toFixed(2) : '-'}</TableCell>
              <TableCell className="text-right">
                {format(new Date(meal.timestamp), "MMM d, hh:mm a")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

