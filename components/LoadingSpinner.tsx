"use client";

import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg p-3 shadow-lg flex items-center gap-3 z-50">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      <p className="text-sm text-gray-600">Loading restaurants...</p>
    </div>
  );
};
