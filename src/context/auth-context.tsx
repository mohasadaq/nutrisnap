
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  type User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import type { z } from 'zod';
import type { authFormSchema } from '@/components/auth/auth-form'; // Assuming auth-form will export this

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (values: z.infer<typeof authFormSchema>) => Promise<User | null>;
  logInWithEmail: (values: z.infer<typeof authFormSchema>) => Promise<User | null>;
  logOut: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>; // Added for flexibility if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (values: z.infer<typeof authFormSchema>) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      setUser(userCredential.user);
      toast({ title: "Registration Successful", description: "Welcome!" });
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ variant: "destructive", title: "Registration Failed", description: error.message || "Please try again." });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logInWithEmail = async (values: z.infer<typeof authFormSchema>) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      setUser(userCredential.user);
      toast({ title: "Login Successful", description: "Welcome back!" });
      return userCredential.user;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ variant: "destructive", title: "Login Failed", description: error.message || "Invalid credentials. Please try again." });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({ variant: "destructive", title: "Logout Failed", description: error.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUpWithEmail, logInWithEmail, logOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
