"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigator = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate password strength
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const data = await axios.post(
        "http://localhost:3001/api/v1/auth/register",
        {
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
        }
      );

      console.log(data);
      navigator.push("/login");
      setIsLoading(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-border/30";
    if (passwordStrength === 1) return "bg-destructive/50";
    if (passwordStrength === 2) return "bg-yellow-500/50";
    if (passwordStrength === 3) return "bg-blue-500/50";
    return "bg-green-500/50";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 transition font-medium"
            >
              Sign in
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
                Create Account
              </h1>
              <p className="text-muted-foreground font-sans">
                Join ChatFlow and start building intelligent chatbots
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium font-sans"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="bg-input border-border/30 focus:border-primary/50 font-sans"
                />
              </div>

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
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-input border-border/30 focus:border-primary/50 font-sans"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium font-sans"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-input border-border/30 focus:border-primary/50 font-sans"
                />
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-border/30 overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrengthColor()} transition-all`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground font-sans">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans">
                      Use at least 8 characters with uppercase, numbers, and
                      symbols
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium font-sans"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-input border-border/30 focus:border-primary/50 font-sans"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 rounded border-border/30 bg-input cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer font-sans"
                >
                  I agree to the{" "}
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
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 gap-2 font-sans"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border/30"></div>
              <span className="text-xs text-muted-foreground font-sans">
                Or sign up with
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 transition font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
