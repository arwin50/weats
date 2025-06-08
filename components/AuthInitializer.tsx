"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { getUserData } from "@/lib/redux/slices/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          console.log("Fetching fresh user data...");
          await dispatch(getUserData()).unwrap();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
