
"use client";

import { AuthForm, authFormSchema } from "@/components/auth/auth-form";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { z } from "zod";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { logInWithEmail, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); 
    }
  }, [user, authLoading, router]);

  const handleLogin = async (values: z.infer<typeof authFormSchema>) => {
    setFormLoading(true);
    const loggedInUser = await logInWithEmail(values);
    if (loggedInUser) {
      router.push('/'); 
    }
    setFormLoading(false);
  };
  
  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthForm onSubmit={handleLogin} loading={formLoading || authLoading} />;
}
