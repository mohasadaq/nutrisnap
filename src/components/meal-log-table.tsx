"use client";

import type { LoggedMeal } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { format } from 'date-fns';
import { Trash2, Flame, Beef, Wheat, Droplet, CalendarDays, Utensils } from 'lucide-react';

interface MealLogTableProps {
  meals: LoggedMeal[];
  onClearLog: () => void;
}

export default function MealLogTable({ meals, onClearLog }: MealLogTableProps) {
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
      <div className="flex justify-end">
        <Button variant="destructive" onClick={onClearLog} size="sm">
          <Trash2 className="mr-2 h-4 w-4" /> Clear Log
        </Button>
      </div>
      <Table className="bg-card shadow-md rounded-lg">
        <TableCaption>A list of your logged meals.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Food</TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              <div className="flex items-center justify-end">
                <Flame className="h-4 w-4 mr-1 text-primary" /> Calories (kcal)
              </div>
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              <div className="flex items-center justify-end">
                <Beef className="h-4 w-4 mr-1 text-primary" /> Protein (g)
              </div>
            </TableHead>
            <TableHead className="text-right hidden lg:table-cell">
              <div className="flex items-center justify-end">
                <Wheat className="h-4 w-4 mr-1 text-primary" /> Carbs (g)
              </div>
            </TableHead>
            <TableHead className="text-right hidden lg:table-cell">
              <div className="flex items-center justify-end">
                <Droplet className="h-4 w-4 mr-1 text-primary" /> Fat (g)
              </div>
            </TableHead>
            <TableHead className="text-right hidden sm:table-cell">
             <div className="flex items-center justify-end">
                <CalendarDays className="h-4 w-4 mr-1 text-primary" /> Date
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals.map((meal) => (
            <TableRow key={meal.id}>
              <TableCell>
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={meal.photoDataUri || "https://placehold.co/64x64.png"}
                    alt={meal.foodIdentification}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="logged food"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{meal.foodIdentification}</TableCell>
              <TableCell className="text-right hidden sm:table-cell">{Math.round(meal.calories)}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{meal.protein.toFixed(1)}</TableCell>
              <TableCell className="text-right hidden lg:table-cell">{meal.carbohydrates.toFixed(1)}</TableCell>
              <TableCell className="text-right hidden lg:table-cell">{meal.fat.toFixed(1)}</TableCell>
              <TableCell className="text-right hidden sm:table-cell">
                {format(new Date(meal.timestamp), "MMM d, hh:mm a")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
