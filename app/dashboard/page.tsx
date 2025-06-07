"use client";

import React, { useEffect, useState } from "react";
import { FoodMap, MapMarker } from "@/components/map";
import { RestaurantListOverlay } from "@/components/RestaurantListOverlay";
import { RestaurantModal } from "@/components/RestaurantModal";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/redux/slices/authSlice";

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
  rank?: number;
}

interface ApiResponse {
  restaurants: Restaurant[];
  count: number;
}

interface WizardPreferences {
  lat: number;
  lng: number;
  preferences: {
    cuisine_type: string;
    dietary_preference: string;
    max_price: number;
  };
}

export default function DashboardPage() {
  const [placeMarkers, setPlaceMarkers] = useState<MapMarker[]>([]);
  const [center, setCenter] = useState({ lat: 10.3157, lng: 123.8854 });
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<MapMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [preferences, setPreferences] = useState<WizardPreferences | null>(
    null
  );

  useEffect(() => {
    // Load preferences from localStorage
    const storedPreferences = localStorage.getItem("wizardPreferences");
    if (storedPreferences) {
      const parsedPreferences = JSON.parse(
        storedPreferences
      ) as WizardPreferences;
      setPreferences(parsedPreferences);
      setCenter({ lat: parsedPreferences.lat, lng: parsedPreferences.lng });
    }
  }, []);

  useEffect(() => {
    // Fetch restaurants when preferences are loaded
    const fetchRestaurants = async () => {
      if (preferences) {
        try {
          const response = await api.post<ApiResponse>("/maps/search_places/", {
            lat: preferences.lat,
            lng: preferences.lng,
            preferences: preferences.preferences,
          });

          if (response.data.restaurants) {
            const markers: MapMarker[] = response.data.restaurants.map(
              (restaurant) => ({
                name: restaurant.name,
                address: restaurant.address,
                lat: restaurant.lat,
                lng: restaurant.lng,
                rating: restaurant.rating,
                price_level: restaurant.price_level,
                types: restaurant.types,
                rank: restaurant.rank,
              })
            );
            setPlaceMarkers(markers);
          }
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
      }
    };

    fetchRestaurants();
  }, [preferences]);

  const handleSelectRestaurant = (restaurant: MapMarker) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const toggleOverlayVisibility = () => {
    setIsOverlayVisible((prev) => !prev);
  };

  return (
    <div>
      <FoodMap markers={placeMarkers} center={center} />

      <button
        onClick={() => {
          toggleOverlayVisibility();
          setSelectedRestaurant(null);
        }}
        className="fixed top-4 left-4 z-30 bg-[#D5DBB5] p-2 rounded shadow text-black hover:bg-[#C2C8A4] transition"
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
