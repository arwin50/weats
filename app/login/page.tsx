"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { login, clearError } from "@/lib/redux/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ email, password })).unwrap();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FEF5E3] flex flex-col items-center justify-center p-4">
      {/* Welcome Title */}
      <h1 className="text-4xl font-bold text-[#5A9785] mt-4 mb-8">
        Welcome back!
      </h1>

      {/* Login Form Container */}
      <div className="bg-[#E3E7D0] rounded-3xl p-6 w-full max-w-sm shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-[#5F6856] text-lg font-medium mb-2">
              Username
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white rounded-full px-6 py-2 text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-[#7BA098]/30"
              placeholder="Input your username"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[#5F6856] text-lg font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white rounded-full px-6 py-2 pr-12 text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-[#7BA098]/30"
                placeholder="Input your password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E07A5F] hover:bg-[#D86C51] text-white font-semibold py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>
      </div>

      {/* Register Link */}
      <div className="mt-8 text-center">
        <span className="text-[#5D6531] text-lg">
          {"Don't have an account? "}
        </span>
        <Link
          href="/register"
          className="text-[#5D6531] text-lg font-semibold hover:underline"
        >
          Register
        </Link>
        <span className="text-[#8B9A8B] text-lg">.</span>
      </div>

      {/* Logo */}
      <div className="mt-4">
        <img src="/app-logo.png" alt="Choosee Logo" className="h-32 w-auto" />
      </div>
    </div>
  );
}
