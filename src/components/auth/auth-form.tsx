
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export const authFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Path to field to display error
});


interface AuthFormProps {
  isRegisterMode?: boolean;
  onSubmit: (values: z.infer<typeof authFormSchema>) => Promise<void>;
  loading: boolean;
}

export function AuthForm({ isRegisterMode = false, onSubmit, loading }: AuthFormProps) {
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(isRegisterMode ? authFormSchema : authFormSchema.omit({ confirmPassword: true })),
    defaultValues: {
      email: "",
      password: "",
      ...(isRegisterMode && { confirmPassword: "" }),
    },
  });

  const title = isRegisterMode ? "Create an Account" : "Welcome Back!";
  const description = isRegisterMode ? "Enter your details to get started." : "Sign in to access your NutriSnap account.";
  const buttonText = isRegisterMode ? "Register" : "Login";
  const buttonIcon = isRegisterMode ? <UserPlus className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />;
  const alternativeActionText = isRegisterMode ? "Already have an account?" : "Don't have an account?";
  const alternativeActionLink = isRegisterMode ? "/login" : "/register";
  const alternativeActionLinkText = isRegisterMode ? "Login" : "Register";


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isRegisterMode && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  buttonIcon
                )}
                {buttonText}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {alternativeActionText}{" "}
            <Link href={alternativeActionLink} className="font-semibold text-primary hover:underline">
              {alternativeActionLinkText}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
