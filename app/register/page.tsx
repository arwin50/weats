"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { registerUser, clearError } from "@/lib/redux/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password !== formData.password_confirmation) {
      setValidationError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      router.push("/login?registered=true");
    } catch (err) {
      // Error is handled by the auth slice
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF5E3] flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#5A9785] mt-4 mb-8">
        Create your account
      </h1>

      {/* Form Container */}
      <div className="bg-[#E3E7D0] rounded-3xl p-6 w-full max-w-sm shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-[#5F6856] text-lg font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email@address.com"
              className="w-full bg-white rounded-full px-6 py-2 text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-[#7BA098]/30"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-[#5F6856] text-lg font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Username"
              className="w-full bg-white rounded-full px-6 py-2 text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-[#7BA098]/30"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#5F6856] text-lg font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full bg-white rounded-full px-6 py-2 pr-12 text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-[#7BA098]/30"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-[#5F6856] text-lg font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                className="w-full bg-white rounded-full px-6 py-2 pr-12 text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-[#7BA098]/30"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {(validationError ||
            (typeof error === "string" ? error : error?.message)) && (
            <div className="mb-4 rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
              {validationError ||
                (typeof error === "string" ? error : error?.message)}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E07A5F] hover:bg-[#D86C51] text-white font-semibold py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>

      {/* Link to Login Page */}
      <div className="mt-8 text-center">
        <span className="text-[#5D6531] text-lg">
          {"Already have an account? "}
        </span>
        <Link
          href="/login"
          className="text-[#5D6531] text-lg font-semibold hover:underline"
        >
          Login
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
