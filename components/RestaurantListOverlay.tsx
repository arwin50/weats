"use client";

import React, { useState } from "react";
import { MapMarker } from "./map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Image from "next/image";
import { useSelector } from "react-redux";
import Link from "next/link";
import { api } from "@/lib/redux/slices/authSlice";

interface RestaurantListOverlayProps {
  restaurants: MapMarker[];
  onSelectRestaurant: (restaurant: MapMarker) => void;
  isVisible: boolean;
  preferences: any;
}

export const RestaurantListOverlay = ({
  restaurants,
  onSelectRestaurant,
  isVisible,
  preferences,
}: RestaurantListOverlayProps) => {
  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const [showModal, setShowModal] = useState(false);

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }

    try {
      const response = await api.post(
        "/suggestions/save_suggestions/",
        {
          lat: preferences.lat,
          lng: preferences.lng,
          preferences: {
            food_preference: preferences.food_preference,
            dietary_preference: preferences.dietary_preference,
            max_price: preferences.max_price,
          },
          restaurants,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      alert("Suggestions saved!");
      console.log("Suggestion response:", response.data);
    } catch (error: any) {
      console.error("Save error:", error.response?.data || error.message);
      alert("Failed to save suggestions.");
    }
  };

  return (
    <>
      <div
        className={`absolute sm:fixed left-0 top-0 sm:top-12 h-[90%] w-[70%] sm:w-100 bg-[#D5DBB5] border-8 border-[#D5DBB5] transform transition-transform duration-300 ease-in-out flex flex-col items-center rounded-r-3xl ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full h-[90%] overflow-y-auto p-4 z-40 rounded-r-xl custom-scrollbar my-4">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="bg-[#FEF5E3] rounded-xl p-3 sm:p-4 mb-4 shadow-md flex items-start gap-3 sm:gap-4 w-full"
            >
              <div className="relative w-14 h-20 sm:w-16 sm:h-24 flex-shrink-0">
                {restaurant.photo_url ? (
                  <Image
                    src={restaurant.photo_url}
                    alt={restaurant.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-black text-sm sm:text-md font-playfair font-semibold leading-snug truncate">
                    {restaurant.name}
                  </h3>
                  <span className="bg-[#8AF085] text-green-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    Open
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-600 mt-1 flex flex-col gap-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span>{restaurant.rating || "None"}</span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 text-gray-700">
                    <div className="flex items-center gap-1">
                      <LocationOnIcon className="text-xs sm:text-sm" fontSize="small" />
                      <span className="text-xs sm:text-sm">0.3km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AccessTimeIcon className="text-xs sm:text-sm" fontSize="small" />
                      <span className="text-xs sm:text-sm">15 mins</span>
                    </div>
                  </div>
                </div>

                <div className="mt-1 flex justify-between items-center gap-2">
                  {restaurant.types?.[0] && (
                    <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full truncate max-w-[60%]">
                      {restaurant.types[0].replace(/_/g, " ")}
                    </span>
                  )}

                  <button
                    onClick={() => onSelectRestaurant(restaurant)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full whitespace-nowrap"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveClick}
          className="bg-teal-500 hover:bg-teal-600 text-white text-center py-2 sm:py-3 mb-5 w-[80%] sm:w-[60%] cursor-pointer rounded-lg text-sm sm:text-base"
        >
          Save Suggestions
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/[75%] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-playfair font-semibold mb-4">
              Save your Choosee prompts now!
            </h2>
            <div className="flex flex-col gap-4 justify-center">
              <Link href="/login">
                <button className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-md w-full cursor-pointer">
                  Log In
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-4 rounded-md w-full cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-500 hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
