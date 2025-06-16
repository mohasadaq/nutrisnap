
import FoodScanSection from '@/components/food-scan-section';
import AuthGuard from '@/components/auth-guard';

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary drop-shadow-sm">
            NutriSnap
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Understand your meals. Instantly.
          </p>
        </header>
        <FoodScanSection />
      </div>
    </AuthGuard>
  );
}
