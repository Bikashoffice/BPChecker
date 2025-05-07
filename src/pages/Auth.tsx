
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ThermometerIcon, KeyIcon, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (values: AuthFormValues) => {
    if (isSignIn) {
      await signIn(values.email, values.password);
    } else {
      await signUp(values.email, values.password);
      setIsSignIn(true); // Switch back to sign in mode after signup
    }
  };

  // Helper function to automatically fill credentials
  const fillCredentials = (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-theme-purple-light/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ThermometerIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-theme-purple-dark bg-clip-text text-transparent">
          BP Checker {isSignIn ? "Login" : "Sign Up"}
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>{isSignIn ? "Sign In" : "Create Account"}</CardTitle>
            <CardDescription>
              {isSignIn
                ? "Enter your credentials to access your account"
                : "Create a new account to start tracking your blood pressure"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
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
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  <KeyIcon className="mr-2 h-4 w-4" />
                  {isSignIn ? "Sign In" : "Sign Up"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4">
              <div className="text-sm text-center text-muted-foreground mb-2">Test accounts</div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fillCredentials("admin@example.com", "admin")}
                  className="text-xs h-8"
                >
                  Use Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fillCredentials("nischit@example.com", "nischit")}
                  className="text-xs h-8"
                >
                  Use Nischit
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => setIsSignIn(!isSignIn)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {isSignIn ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
