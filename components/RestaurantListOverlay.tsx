"use client";

import React from "react";
import { MapMarker } from "./map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Image from "next/image";

interface RestaurantListOverlayProps {
  restaurants: MapMarker[];
  onSelectRestaurant: (restaurant: MapMarker) => void;
  isVisible: boolean;
}

export const RestaurantListOverlay = ({
  restaurants,
  onSelectRestaurant,
  isVisible,
}: RestaurantListOverlayProps) => {
  return (
    <div
      className={`fixed left-0 top-12 h-[90%] w-[30%] bg-[#D5DBB5] border-8 border-[#D5DBB5] overflow-y-auto p-4 z-40 shadow-md rounded-r-xl custom-scrollbar transform transition-transform duration-300 ease-in-out" ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {restaurants.map((restaurant, index) => (
        <div
          key={index}
          className="bg-[#FEF5E3] rounded-xl p-4 mb-4 shadow-md flex items-start gap-4"
        >
          {/* Restaurant photo */}
          <div className="relative w-16 h-24 flex-shrink-0">
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

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-black text-md font-playfair font-semibold leading-snug">
                {restaurant.name}
              </h3>
              <span className="bg-[#8AF085] text-green-700 text-xs px-2 py-1 rounded-full">
                Open
              </span>
            </div>

            <div className="text-sm text-gray-600 mt-1 flex flex-col gap-1">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★</span>
                <span>{restaurant.rating || "None"}</span>
              </div>

              <div className="flex items-center gap-4 text-gray-700">
                <div className="flex items-center gap-1">
                  <LocationOnIcon className="text-sm" fontSize="small" />
                  <span className="text-sm">0.3km</span>
                </div>
                <div className="flex items-center gap-1">
                  <AccessTimeIcon className="text-sm" fontSize="small" />
                  <span className="text-sm">15 mins</span>
                </div>
              </div>
            </div>

            <div className="mt-1 flex justify-between items-center">
              {restaurant.types?.[0] && (
                <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">
                  {restaurant.types[0].replace(/_/g, " ")}
                </span>
              )}

              <button
                onClick={() => onSelectRestaurant(restaurant)}
                className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
