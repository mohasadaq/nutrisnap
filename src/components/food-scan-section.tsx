
"use client";

import { useState, useRef, type ChangeEvent, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, UploadCloud, Sparkles, Camera, SwitchCamera } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // For capturing image from video
  const { toast } = useToast();

  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Effect for managing camera stream
  useEffect(() => {
    if (showCamera) {
      const getCameraPermission = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          setHasCameraPermission(false);
          setError("Camera access was denied or is unavailable. Please check your browser settings.");
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
          setShowCamera(false); // Switch back to file upload mode
        }
      };
      getCameraPermission();
    } else {
      // Cleanup: stop camera stream when not shown or component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCamera]);


  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Invalid file type. Please upload an image.");
        toast({ variant: "destructive", title: "Upload Error", description: "Invalid file type. Please upload an image (e.g., JPG, PNG)." });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setImagePreview(null); setImageDataUri(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Maximum size is 5MB.");
        toast({ variant: "destructive", title: "Upload Error", description: "File is too large. Maximum size is 5MB." });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setImagePreview(null); setImageDataUri(null);
        return;
      }

      setError(null); setScanResult(null); setShowCamera(false); // Ensure camera is off
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
        setShowCamera(false); // Hide camera, show preview
        setScanResult(null);
        setError(null);
      } else {
         setError("Could not capture image from camera.");
         toast({variant: "destructive", title: "Capture Error", description: "Failed to capture image from camera."});
      }
    }
  }, [hasCameraPermission]);

  const handleSubmit = async () => {
    if (!imageDataUri) {
      setError("Please select or capture an image first.");
      toast({ variant: "destructive", title: "No Image", description: "Please select an image of your food to analyze." });
      return;
    }
    setIsLoading(true); setError(null); setScanResult(null);
    try {
      const result = await scanFoodAndAnalyzeNutrition({ photoDataUri: imageDataUri });
      setScanResult({ ...result.nutritionAnalysis, foodIdentification: result.foodIdentification, photoDataUri: imageDataUri });
    } catch (err) {
      console.error("AI analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      setError(`Failed to analyze food: ${errorMessage}`);
      toast({ variant: "destructive", title: "Analysis Failed", description: `Could not analyze the food image. ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCameraMode = () => {
    if (showCamera) { // Turning camera off
      setShowCamera(false);
    } else { // Turning camera on
      setImagePreview(null);
      setImageDataUri(null);
      setScanResult(null);
      setError(null);
      setShowCamera(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-headline flex items-center justify-center">
            {showCamera ? <Camera className="mr-2 h-7 w-7 text-primary" /> : <UploadCloud className="mr-2 h-7 w-7 text-primary" />}
            {showCamera ? 'Scan with Camera' : 'Upload Your Food Image'}
          </CardTitle>
          <CardDescription className="text-center">
            {showCamera ? 'Position your food item in the frame and capture.' : 'Let our AI analyze the nutritional content of your meal.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-4">
            <Button variant="outline" onClick={toggleCameraMode} className="gap-2">
              {showCamera ? <UploadCloud /> : <Camera />}
              {showCamera ? 'Upload File Instead' : 'Use Camera'}
            </Button>
          </div>

          {showCamera ? (
            <div className="space-y-4">
              <video ref={videoRef} className="w-full aspect-video rounded-md border bg-muted" autoPlay muted playsInline />
              {hasCameraPermission === false && !error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Camera Permission Denied</AlertTitle>
                  <AlertDescription>
                    Please grant camera access in your browser settings to use this feature.
                  </AlertDescription>
                </Alert>
              )}
              {hasCameraPermission && (
                <Button onClick={handleCaptureImage} disabled={isLoading} className="w-full text-lg py-6">
                  <Camera className="mr-2 h-5 w-5" />
                  Capture Photo
                </Button>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {!showCamera && (
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
          )}
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
