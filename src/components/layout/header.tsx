
"use client"; 

import Link from 'next/link';
import { ScanLine, BookOpen } from 'lucide-react'; // Removed LogIn, UserPlus, LogOut, UserCircle
// import { useAuth } from '@/context/auth-context'; // Removed
// import { Button } from '@/components/ui/button'; // Button not used directly anymore
// Removed DropdownMenu imports
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Removed Avatar imports


export default function Header() {
  // const { user, logOut, loading } = useAuth(); // Removed

  // const getInitials = (email?: string | null) => { // Removed
  //   if (!email) return "U";
  //   return email.substring(0, 2).toUpperCase();
  // };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
          NutriSnap
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {/* Always show Scan and Log links now */}
          <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md text-sm sm:text-base">
            <ScanLine className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Scan</span>
          </Link>
          <Link href="/log" className="flex items-center text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md text-sm sm:text-base">
            <BookOpen className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Log</span>
          </Link>

          {/* Removed auth-related buttons and dropdown */}
        </nav>
      </div>
    </header>
  );
}
