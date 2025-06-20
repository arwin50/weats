"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginUser, clearError } from "@/lib/redux/slices/authSlice";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password })).unwrap();
  };

  return (
    <div className="min-h-screen bg-[#FEF5E3] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Welcome Title */}
      <h1 className="text-3xl xs:text-4xl font-bold text-[#5A9785] mt-4 mb-6 sm:mb-8">
        Welcome back!
      </h1>

      {/* Login Form Container */}
      <div className="bg-[#E3E7D0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-[#5F6856] text-base sm:text-lg font-medium mb-1 sm:mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-[#7BA098]/30"
              placeholder="Input your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[#5F6856] text-base sm:text-lg font-medium mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white rounded-full px-4 sm:px-6 py-2 pr-10 sm:pr-12 text-sm sm:text-base text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-[#7BA098]/30"
                placeholder="Input your password"
              />
              <button
                type="button"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-xs sm:text-sm">
              {typeof error === "string"
                ? error
                : error.message || "An unexpected error occurred"}
            </div>
          )}

          {/* Login Button */}
          <div className="pt-1 sm:pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E07A5F] hover:bg-[#D86C51] text-white font-semibold py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>
      </div>

      {/* Register Link */}
      <div className="mt-6 sm:mt-8 text-center">
        <span className="text-[#5D6531] text-sm sm:text-lg">
          {"Don't have an account? "}
        </span>
        <Link
          href="/register"
          className="text-[#5D6531] text-sm sm:text-lg font-semibold hover:underline"
        >
          Register
        </Link>
        <span className="text-[#8B9A8B] text-sm sm:text-lg">.</span>
      </div>

      {/* Logo */}
      <div className="mt-4 sm:mt-6">
        <Image
          src="/app-logo.png"
          alt="Choosee Logo"
          width={128}
          height={128}
          className="h-24 sm:h-32 w-auto"
        />
      </div>
    </div>
  );
}
