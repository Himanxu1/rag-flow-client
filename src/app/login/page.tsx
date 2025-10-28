"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/v1/auth/signin",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (data.status) {
        console.log("Login successful:", data);
        login(data.token);
        router.push("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }

    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-sans">ChatFlow</span>
          </Link>
          <div className="text-sm text-muted-foreground font-sans">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 transition font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="glass rounded-2xl p-8 glow-cyan">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 font-sans">
                Welcome Back
              </h1>
              <p className="text-muted-foreground font-sans">
                Sign in to your ChatFlow account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium font-sans"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input border-border/30 focus:border-primary/50 font-sans"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium font-sans"
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:text-primary/80 transition font-sans"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input border-border/30 focus:border-primary/50 font-sans"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 gap-2 font-sans"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border/30"></div>
              <span className="text-xs text-muted-foreground font-sans">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-border/30"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-border/30 hover:bg-card/50 bg-transparent font-sans"
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="border-border/30 hover:bg-card/50 bg-transparent font-sans"
              >
                GitHub
              </Button>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-muted-foreground mt-6 font-sans">
            By signing in, you agree to our{" "}
            <Link
              href="#"
              className="text-primary hover:text-primary/80 transition"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-primary hover:text-primary/80 transition"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
