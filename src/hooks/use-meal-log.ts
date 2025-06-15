"use client";

import { useState, useEffect, useCallback } from 'react';
import type { LoggedMeal, ScannedFoodItem } from '@/lib/types';

const MEAL_LOG_STORAGE_KEY = 'nutrisnap-meal-log';

export function useMealLog() {
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedMeals = localStorage.getItem(MEAL_LOG_STORAGE_KEY);
        if (storedMeals) {
          setLoggedMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error("Failed to load meals from localStorage:", error);
        // Initialize with empty array if parsing fails or localStorage is corrupt
        setLoggedMeals([]);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      try {
        localStorage.setItem(MEAL_LOG_STORAGE_KEY, JSON.stringify(loggedMeals));
      } catch (error) {
        console.error("Failed to save meals to localStorage:", error);
      }
    }
  }, [loggedMeals, isLoaded]);

  const addMeal = useCallback((meal: ScannedFoodItem) => {
    const newLoggedMeal: LoggedMeal = {
      ...meal,
      id: new Date().toISOString() + Math.random().toString(36).substring(2, 9), // More robust ID
      timestamp: new Date().toISOString(),
    };
    setLoggedMeals((prevMeals) => [newLoggedMeal, ...prevMeals]);
  }, []);
  
  const clearLog = useCallback(() => {
    setLoggedMeals([]);
  }, []);


  return { loggedMeals, addMeal, isLoaded, clearLog };
}
