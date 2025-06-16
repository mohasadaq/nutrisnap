
"use client"; 

import Link from 'next/link';
import { ScanLine, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
          NutriSnap
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Link href="/?camera=true" className="flex items-center text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md text-sm sm:text-base">
            <ScanLine className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Scan</span>
          </Link>
          <Link href="/log" className="flex items-center text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md text-sm sm:text-base">
            <BookOpen className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Log</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
