import Link from 'next/link';
import { ScanLine, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
          NutriSnap
        </Link>
        <nav className="flex items-center space-x-4 sm:space-x-6">
          <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors">
            <ScanLine className="mr-1 h-5 w-5" />
            <span className="hidden sm:inline">Scan</span>
          </Link>
          <Link href="/log" className="flex items-center text-foreground hover:text-primary transition-colors">
            <BookOpen className="mr-1 h-5 w-5" />
            <span className="hidden sm:inline">Log</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
