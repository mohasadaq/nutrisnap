"use client";

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, UploadCloud, Sparkles } from 'lucide-react';
import NutritionDisplayCard from './nutrition-display-card';
import type { ScannedFoodItem } from '@/lib/types';
import { scanFoodAndAnalyzeNutrition } from '@/ai/flows/scan-food-and-analyze-nutrition';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FoodScanSection() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedFoodItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Invalid file type. Please upload an image.");
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: "Invalid file type. Please upload an image (e.g., JPG, PNG).",
        });
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
        setImagePreview(null);
        setImageDataUri(null);
        return;
      }
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
         setError("File is too large. Maximum size is 5MB.");
         toast({
          variant: "destructive",
          title: "Upload Error",
          description: "File is too large. Maximum size is 5MB.",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setImagePreview(null);
        setImageDataUri(null);
        return;
      }

      setError(null);
      setScanResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageDataUri) {
      setError("Please select an image first.");
      toast({
        variant: "destructive",
        title: "No Image",
        description: "Please select an image of your food to analyze.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const result = await scanFoodAndAnalyzeNutrition({ photoDataUri: imageDataUri });
      setScanResult({ ...result.nutritionAnalysis, foodIdentification: result.foodIdentification, photoDataUri: imageDataUri });
    } catch (err) {
      console.error("AI analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      setError(`Failed to analyze food: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: `Could not analyze the food image. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-headline flex items-center justify-center">
            <UploadCloud className="mr-2 h-7 w-7 text-primary" />
            Upload Your Food Image
          </CardTitle>
          <CardDescription className="text-center">
            Let our AI analyze the nutritional content of your meal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="file:text-primary file:font-semibold file:bg-primary/10 hover:file:bg-primary/20 file:rounded-md file:border-0"
            aria-label="Upload food image"
          />

          {imagePreview && (
            <div className="mt-4 p-2 border border-dashed border-border rounded-lg aspect-video relative w-full max-w-md mx-auto overflow-hidden">
              <Image src={imagePreview} alt="Food preview" layout="fill" objectFit="contain" data-ai-hint="food preview" />
            </div>
          )}

          <Button onClick={handleSubmit} disabled={isLoading || !imagePreview} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Meal
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {error && !isLoading && (
         <Alert variant="destructive" className="animate-in fade-in-0 duration-300">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {scanResult && !isLoading && (
        <NutritionDisplayCard item={scanResult} />
      )}
    </div>
  );
}
