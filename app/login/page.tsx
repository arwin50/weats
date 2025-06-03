"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { login, clearError } from "@/lib/redux/slices/authSlice";
import LoadingScreen from "@/components/loadingScreen";

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8E7] p-4">
      <div className="w-full max-w-md rounded-lg bg-[#E2EAD8] p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#5B9A8B]">Welcome back!</h2>
          <p className="text-[#5B9A8B] pt-2">
            Enter your credentials to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-[#5B9A8B]"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email@address.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md bg-white px-3 py-2 text-sm border border-[#5B9A8B]/20 focus:border-[#5B9A8B] focus:outline-none focus:ring focus:ring-[#5B9A8B]/20"
            />
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-[#5B9A8B]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md bg-white px-3 py-2 text-sm border border-[#5B9A8B]/20 focus:border-[#5B9A8B] focus:outline-none focus:ring focus:ring-[#5B9A8B]/20"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md border border-[#E07A5F] bg-[#E07A5F] py-3 text-white hover:bg-[#D86C51] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#5B9A8B]">Don&apos;t have an account? </span>
            <Link href="/register" className="text-[#3D8361] hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <img src="/logo.png" alt="Choosee Logo" className="h-16 w-auto" />
      </div>
    </div>
  );
}
