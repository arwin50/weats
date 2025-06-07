"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth, getUserData } from "@/lib/redux/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        console.log("Initializing auth state...");
        dispatch(initializeAuth());

        // If we have a token, fetch fresh user data
        const token = localStorage.getItem("access_token");
        if (token) {
          console.log("Fetching fresh user data...");
          dispatch(getUserData());
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  }, [dispatch]);

  return null;
}
