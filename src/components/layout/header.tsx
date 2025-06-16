
"use client"; // Required for using hooks like useAuth

import Link from 'next/link';
import { ScanLine, BookOpen, LogIn, UserPlus, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Header() {
  const { user, logOut, loading } = useAuth();

  const getInitials = (email?: string | null) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
          NutriSnap
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {user && (
            <>
              <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md text-sm sm:text-base">
                <ScanLine className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Scan</span>
              </Link>
              <Link href="/log" className="flex items-center text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md text-sm sm:text-base">
                <BookOpen className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Log</span>
              </Link>
            </>
          )}

          {loading ? (
            <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
          ) : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    {/* Placeholder for user image if available in future */}
                    {/* <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} /> */}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Add more items here like Profile, Settings if needed */}
                {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={logOut} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login" className="flex items-center">
                  <LogIn className="mr-1 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/register" className="flex items-center">
                  <UserPlus className="mr-1 h-4 w-4" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
