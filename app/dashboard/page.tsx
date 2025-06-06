"use client";

import React, { useEffect, useState } from "react";
import { FoodMap, MapMarker } from "@/components/map";
import { RestaurantListOverlay } from "@/components/RestaurantListOverlay";
import { RestaurantModal } from "@/components/RestaurantModal";
import axios from "axios";

import { Eye, EyeOff } from "lucide-react";

interface Restaurant {
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number | null;
  types?: string[];
  description?: string;
  recommendation_reason?: string;
}

interface ApiResponse {
  restaurants: Restaurant[];
  count: number;
}

export default function DashboardPage() {
  const [placeMarkers, setPlaceMarkers] = useState<MapMarker[]>([]);
  const [center, setCenter] = useState({ lat: 10.3157, lng: 123.8854 });
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<MapMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const handleSelectRestaurant = (restaurant: MapMarker) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const toggleOverlayVisibility = () => {
    setIsOverlayVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchPlacesonArea = async () => {
      try {
        console.log("Attempting to fetch places...");
        const response = await axios.post<ApiResponse>(
          "http://localhost:8000/api/search_places/",
          {
            lat: center.lat,
            lng: center.lng,
            preferences: {
              cuisine_type: "Filipino",
              dietary_preference: "None",
              max_price: 1000,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("Response received:", response.data);

        setPlaceMarkers(response.data.restaurants);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchPlacesonArea();
  }, [center]);

  return (
    <div>
      <FoodMap markers={placeMarkers} center={center} />

      <button
        onClick={toggleOverlayVisibility}
        className="absolute top-4 left-4 z-50 bg-[#D5DBB5] p-2 rounded shadow text-black hover:bg-[#C2C8A4] transition"
      >
        {isOverlayVisible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>

      <RestaurantListOverlay
        restaurants={placeMarkers}
        onSelectRestaurant={handleSelectRestaurant}
        isVisible={isOverlayVisible}
      />

      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
