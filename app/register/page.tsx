"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { register, clearError } from "@/lib/redux/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

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
      await dispatch(register(formData)).unwrap();
      router.push("/login?registered=true");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8E7] p-4">
      <div className="w-full max-w-md rounded-lg bg-[#E2EAD8] p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#5B9A8B]">
            Create an Account
          </h2>
          <p className="text-[#5B9A8B]">
            Enter your details to create a new account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="mb-4 rounded-md border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
              {validationError || error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-[#5B9A8B]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email@address.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-white px-3 py-2 text-sm border border-[#5B9A8B]/20 focus:border-[#5B9A8B] focus:outline-none focus:ring focus:ring-[#5B9A8B]/20"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-[#5B9A8B]"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-white px-3 py-2 text-sm border border-[#5B9A8B]/20 focus:border-[#5B9A8B] focus:outline-none focus:ring focus:ring-[#5B9A8B]/20"
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-[#5B9A8B]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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

          <div className="mb-6 relative">
            <label
              htmlFor="password_confirmation"
              className="mb-1 block text-sm font-medium text-[#5B9A8B]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="password_confirmation"
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-white px-3 py-2 text-sm border border-[#5B9A8B]/20 focus:border-[#5B9A8B] focus:outline-none focus:ring focus:ring-[#5B9A8B]/20"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md border border-[#5B9A8B] bg-[#5B9A8B] py-3 text-white hover:bg-[#4A8A7B] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#5B9A8B]">Already have an account? </span>
            <Link href="/login" className="text-[#3D8361] hover:underline">
              Login
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
