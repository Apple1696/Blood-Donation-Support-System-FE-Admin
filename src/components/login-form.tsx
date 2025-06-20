"use client";

import type React from "react";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/config/api";
import { toast } from "sonner";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ className, onSwitchToSignup, ...props }: LoginFormProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) {
      toast.error("Authentication service is not ready. Please try again later.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        toast.success("Login successful! Redirecting...");

        // Wait briefly to ensure user data is loaded
        setTimeout(async () => {
          try {
            const res = await api.get('/staffs/me');
            const role = res.data?.data?.role;

            if (role === "admin") {
              navigate("/admin/dashboard");
            } else if (role === "doctor" || role === "staff") {
              navigate("/staff");
            } else {
              console.error("Unknown role from API:", role);
              toast.error("Unknown role. Redirecting to homepage.");
              navigate("/");
            }
          } catch (error) {
            console.error("Failed to fetch user role:", error);
            toast.error("Failed to fetch user role. Redirecting to homepage.");
            navigate("/");
          }
        }, 100);
      } else {
        console.error("Login failed:", signInAttempt);
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      toast.error("An error occurred during login. Please try again.");
    }
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
            name="email"
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
            name="password"
            type="password"
            required
            className="border-gray-300 focus:border-red-600"
          />
        </div>
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={!isLoaded}>
          Login
        </Button>
      </div>
    </form>
  );
}