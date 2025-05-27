"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ className, onSwitchToSignup, ...props }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login form submitted");
    // Handle login logic here
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Connect to BloodLink</h1>       
      </div>
      <div className="grid gap-6">
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
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="border-gray-300 focus:border-red-600"
          />
        </div>
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
          Login
        </Button>       
      </div>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="underline underline-offset-4 hover:text-red-600"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}