"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ className, onSwitchToLogin, ...props }: SignupFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Signup form submitted");
    // Handle signup logic here
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Join in our Hub</h1>      
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            required
            className="border-gray-300 focus:border-red-600"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            required
            className="border-gray-300 focus:border-red-600"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="abc@gmail.com"
            required
            className="border-gray-300 focus:border-red-600"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            className="border-gray-300 focus:border-red-600"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            className="border-gray-300 focus:border-red-600"
          />
        </div>
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
          Create Account
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="underline underline-offset-4 hover:text-red-600"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}