
"use client";

import MealLogTable from '@/components/meal-log-table';
import { useMealLog } from '@/hooks/use-meal-log';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpenText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import AuthGuard from '@/components/auth-guard'; // Removed AuthGuard
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';


function MealLogContent() {
  const { loggedMeals, isLoaded, clearLog } = useMealLog();
  const { toast } = useToast();

  const handleClearLog = () => {
    clearLog();
    toast({
      title: "Log Cleared",
      description: "Your meal log has been successfully cleared.",
    });
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-center text-center mb-8">
          <BookOpenText className="h-10 w-10 mr-3 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Your Meal Log
          </h1>
        </div>
        <Skeleton className="h-12 w-1/4 ml-auto mb-4" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <BookOpenText className="h-10 w-10 mr-3 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Your Meal Log
          </h1>
        </div>
        {loggedMeals.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Clear All Meals
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your logged meals.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearLog} className="bg-destructive hover:bg-destructive/90">
                  Yes, clear log
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <MealLogTable meals={loggedMeals} onClearLog={handleClearLog} />
    </div>
  );
}

export default function MealLogPage() {
  return (
    // <AuthGuard> // Removed AuthGuard
      <MealLogContent />
    // </AuthGuard> // Removed AuthGuard
  );
}
