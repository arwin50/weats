"use client";

import { useState, useEffect } from "react";
import type { MapMarker } from "./map";
import PlaceIcon from "@mui/icons-material/Place";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { authApi } from "@/lib/redux/slices/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";

interface RestaurantModalProps {
  restaurant: MapMarker | null;
  isOpen: boolean;
  onClose: () => void;
  travelInfo?: {
    distanceText: string;
    durationText: string;
  } | null;
  onVisitedUpdate?: () => void;
}

export const RestaurantModal = ({
  restaurant,
  isOpen,
  onClose,
  travelInfo,
  onVisitedUpdate,
}: RestaurantModalProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isVisited, setIsVisited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkVisitedStatus = async () => {
      if (!restaurant) return;
      try {
        const response = await authApi.post("/visited/check_visited/", {
          location: {
            name: restaurant.name,
            address: restaurant.address,
          },
        });
        setIsVisited(response.data.is_visited);
      } catch (err) {
        console.error("Error checking visited status:", err);
      }
    };

    if (isOpen && restaurant) {
      checkVisitedStatus();
    }
  }, [isOpen, restaurant]);

  const handleToggleVisited = async () => {
    if (!restaurant) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.post("/visited/toggle_visited/", {
        location: {
          name: restaurant.name,
          address: restaurant.address,
          lat: restaurant.lat,
          lng: restaurant.lng,
          rating: restaurant.rating,
          user_ratings_total: restaurant.user_ratings_total,
          price_level: restaurant.price_level,
          types: restaurant.types,
          description: restaurant.description,
          recommendation_reason: restaurant.recommendation_reason,
          photo_url: restaurant.photo_url,
        },
        notes: `Visited ${restaurant.name}`,
      });

      setIsVisited(response.data.is_visited);

      if (onVisitedUpdate) {
        onVisitedUpdate();
      }
    } catch (err) {
      console.error("Error toggling visited status:", err);
      setError("Failed to update visited status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !restaurant) return null;

  return (
    <div className="fixed top-15 right-5 max-h-[85%] w-[350px] bg-[#FEF5E3] border-10 border-[#D5DBB5] shadow-lg rounded-2xl z-100 overflow-y-auto text-black custom-scrollbar">
      {/* Image area */}
      <div className="relative h-48 w-full">
        {restaurant.photo_url ? (
          <Image
            src={restaurant.photo_url}
            alt={restaurant.name}
            fill
            className="object-cover rounded-t-2xl"
          />
        ) : (
          <div className="h-full w-full bg-gray-300 rounded-t-2xl flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Content area */}
      <div className="p-4">
        {/* Restaurant name and status */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl text-black font-playfair font-bold leading-tight">
            {restaurant.name}
          </h2>
          <span className="bg-[#8AF085] text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Open
          </span>
        </div>

        {/* Rating */}
        {restaurant.rating && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="font-semibold">{restaurant.rating}</span>
            {restaurant.user_ratings_total && (
              <span className="text-gray-600">
                ({restaurant.user_ratings_total})
              </span>
            )}
          </div>
        )}

        {/* Distance and time info */}
        {travelInfo && (
          <div className="text-sm text-gray-600 mt-2">
            <p>🚗 Distance: {travelInfo.distanceText}</p>
            <p>⏱ Duration: {travelInfo.durationText}</p>
          </div>
        )}

        {/* Restaurant Address */}
        <div className="flex items-start gap-2 mb-2">
          <PlaceIcon
            className="text-sm mt-0.5 flex-shrink-0"
            fontSize="small"
          />
          <p className="text-gray-700 text-sm">{restaurant.address}</p>
        </div>

        {/* Cuisine types */}
        {restaurant.types && (
          <div className="flex flex-wrap gap-2 mb-3">
            {restaurant.types.map((type, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-sm"
              >
                {type.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}

        {/* About and Recommendations */}
        <div className="space-y-4">
          {restaurant.description && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-700 text-sm">{restaurant.description}</p>
            </div>
          )}

          {restaurant.recommendation_reason && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                Why We Recommend
              </h3>
              <p className="text-blue-800 text-sm">
                {restaurant.recommendation_reason}
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        {/* Mark as visited button */}
        <button
          onClick={handleToggleVisited}
          disabled={isLoading}
          className={`w-full ${
            isVisited
              ? "bg-gray-400 hover:bg-gray-500"
              : "bg-[#5A9785] hover:bg-[#48796B]"
          } text-white py-2 px-4 rounded-full font-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {user && isLoading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Updating...
            </span>
          ) : isVisited ? (
            "Remove from Visited"
          ) : (
            "Mark as Visited"
          )}
        </button>
      </div>
    </div>
  );
};
