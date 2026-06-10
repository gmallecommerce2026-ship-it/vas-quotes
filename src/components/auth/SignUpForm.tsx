"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import { EyeIcon, EyeCloseIcon, ChevronLeftIcon } from "@/icons";

export default function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await AuthService.signup(fullName, username, password);
      alert("Registration successful! Please sign in.");
      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account 🚀</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Join B-Donor to start your journey of saving lives.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-50 border-gray-200 h-11"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-50 border-gray-200 h-11"
              required
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="johndoe123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border-gray-200 h-11"
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
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border-gray-200 h-11 pr-10"
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

        {/* Terms */}
        <div>
          <div className="flex items-start gap-3">
            <div className="pt-0.5">
               <Checkbox checked={agreeTerms} onChange={setAgreeTerms} />
            </div>
            <label className="text-sm text-gray-500 cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
              I agree to the <span className="text-gray-900 font-medium hover:underline">Terms of Service</span> and <span className="text-gray-900 font-medium hover:underline">Privacy Policy</span>.
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-base font-semibold shadow-lg shadow-red-600/20"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-bold text-red-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}