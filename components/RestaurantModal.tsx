"use client";

import type { MapMarker } from "./map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CloseIcon from "@mui/icons-material/Close";

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
    
    <div className="fixed top-15 right-5 max-h-[85%] w-[350px] bg-[#FEF5E3] border-10 border-[#D5DBB5] shadow-lg rounded-2xl z-100 overflow-y-auto text-black custom-scrollbar">
      
      {/* Image placeholder area */}
      <div className="relative h-30 bg-gray-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-5 h-5 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
      
    
      {/* Content area */}
      <div className="p-6 bg-[#FEF5E3]">
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
        <div className="flex items-center gap-4 mb-2 text-gray-700">
          <div className="flex items-center gap-1">
            <LocationOnIcon className="text-sm" fontSize="small" />
            <span className="text-sm">0.3km</span>
          </div>
          <div className="flex items-center gap-1">
            <AccessTimeIcon className="text-sm" fontSize="small" />
            <span className="text-sm">15 mins</span>
          </div>
        </div>

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
        <div className="space-y-4 mb-4">
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

        {/* Mark as visited button */}
        <button className="w-full bg-[#5A9785] hover:bg-[#48796B] text-white py-2 px-4 rounded-full font-lg transition-colors">
          Mark as visited
        </button>
      </div>
    </div>
  );
};
