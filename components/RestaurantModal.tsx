"use client";

import React from "react";
import { MapMarker } from "./map";

interface RestaurantModalProps {
  restaurant: MapMarker | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RestaurantModal = ({
  restaurant,
  isOpen,
  onClose,
}: RestaurantModalProps) => {
  if (!isOpen || !restaurant) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{restaurant.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">{restaurant.address}</p>

          {restaurant.rating && (
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★</span>
              <span>{restaurant.rating}</span>
              {restaurant.user_ratings_total && (
                <span className="text-gray-500">
                  ({restaurant.user_ratings_total} reviews)
                </span>
              )}
            </div>
          )}

          {restaurant.types && (
            <div className="flex flex-wrap gap-2">
              {restaurant.types.map((type, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                >
                  {type.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-700">{restaurant.description}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Why We Recommend
            </h3>
            <p className="text-blue-800">{restaurant.recommendation_reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
