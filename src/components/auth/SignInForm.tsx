"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import { EyeIcon, EyeCloseIcon, ChevronLeftIcon } from "@/icons"; // Đảm bảo import HeartPulse từ icons hoặc lucide-react

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Form */}
      <div className="mb-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Please sign in to your account to continue.
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-5">
        
        {/* Username */}
        <div>
          <Label htmlFor="username">Username / Email</Label>
          <Input 
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeCloseIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox 
              id="remember" 
              checked={remember} 
              onChange={setRemember} 
              label="Remember me"
            />
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-base font-semibold shadow-lg shadow-red-600/20"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-red-600 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}