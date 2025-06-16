
import FoodScanSection from '@/components/food-scan-section';
import { Suspense } from 'react';

// Helper component for fallback UI
function LoadingScanner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="ml-4 text-muted-foreground">Loading scanner...</p>
    </div>
  );
}

export default function HomePage() {
  return (
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary drop-shadow-sm">
            NutriSnap
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Understand your meals. Instantly.
          </p>
        </header>
        <Suspense fallback={<LoadingScanner />}>
          <FoodScanSection />
        </Suspense>
      </div>
  );
}
