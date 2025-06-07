"use client";

import React, { useEffect, useState } from "react";
import { FoodMap, MapMarker } from "@/components/map";
import { RestaurantListOverlay } from "@/components/RestaurantListOverlay";
import { PreviousPromptOverlay } from "@/components/PreviousPromptOverlay";
import { RecentlyVisitedOverlay } from "@/components/RecentlyVisitedOverlay";
import { RestaurantModal } from "@/components/RestaurantModal";
import { Eye, EyeOff, Book, MapPin, Star } from "lucide-react";
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
  const [selectedRestaurant, setSelectedRestaurant] = useState<MapMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [preferences, setPreferences] = useState<WizardPreferences | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<"restaurant" | "previous" | "recently" | null>("restaurant");
  const [recentlyVisited, setRecentlyVisited] = useState<MapMarker[]>([]);


  useEffect(() => {
    const storedPreferences = localStorage.getItem("wizardPreferences");
    if (storedPreferences) {
      const parsedPreferences = JSON.parse(storedPreferences) as WizardPreferences;
      setPreferences(parsedPreferences);
      setCenter({ lat: parsedPreferences.lat, lng: parsedPreferences.lng });
    }
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (preferences) {
        try {
          const response = await api.post<ApiResponse>("/maps/search_places/", {
            lat: preferences.lat,
            lng: preferences.lng,
            preferences: preferences.preferences,
          });

          if (response.data.restaurants) {
            const markers: MapMarker[] = response.data.restaurants.map((restaurant) => ({
              name: restaurant.name,
              address: restaurant.address,
              lat: restaurant.lat,
              lng: restaurant.lng,
              rating: restaurant.rating,
              price_level: restaurant.price_level,
              types: restaurant.types,
            }));
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

    // Add to recently visited, avoiding duplicates
    setRecentlyVisited((prev) => {
      const exists = prev.find((r) => r.name === restaurant.name);
      if (exists) return prev;
      return [restaurant, ...prev].slice(0, 10); // limit to 10
    });
  };

  const toggleOverlayVisibility = () => {
    setIsOverlayVisible((prev) => !prev);
    setSelectedRestaurant(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <FoodMap markers={placeMarkers} center={center} />

      <button
        onClick={toggleOverlayVisibility}
        className="fixed top-2 left-2 z-50 bg-[#C2C8A4] p-2 rounded shadow text-black hover:bg-[#B0B68F] transition"
      >
        {isOverlayVisible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>

      <div
        className={`fixed z-40 flex md:flex-col flex-row md:top-15 top-auto bottom-4 left-0 md:left-0 md:h-[90%] w-full md:w-auto items-center md:items-start gap-2 px-2 md:px-0 transition-transform duration-300 ${isOverlayVisible ? "translate-x-51" : "-translate-x-full md:-translate-x-full"
          }`}
      >
        <div
          onClick={() => setActiveOverlay("restaurant")}
          className="w-15 h-12 md:w-25 md:h-16 bg-[#D5DBB5] rounded-full flex items-center justify-center hover:bg-[#BFC59A] cursor-pointer"
        >
          <Book size={30} className="text-green-900" />
        </div>
        <div
          onClick={() => setActiveOverlay("recently")}
          className="w-12 h-12 md:w-25 md:h-16 bg-[#FFF396] rounded-full flex items-center justify-center hover:bg-[#E6E272] cursor-pointer"
        >
          <MapPin size={30} className="text-green-900" />
        </div>
        <div
          onClick={() => setActiveOverlay("previous")}
          className="w-12 h-12 md:w-25 md:h-16 bg-[#FF9268] rounded-full flex items-center justify-center hover:bg-[#E57E56] cursor-pointer"
        >
          <Star size={30} className="text-green-900" />
        </div>
      </div>

      {activeOverlay === "restaurant" && (
        <RestaurantListOverlay
          restaurants={placeMarkers}
          onSelectRestaurant={handleSelectRestaurant}
          isVisible={isOverlayVisible}
        />
      )}
      {activeOverlay === "previous" && (
        <PreviousPromptOverlay isVisible={isOverlayVisible} />
      )}
      {activeOverlay === "recently" && (
        <RecentlyVisitedOverlay
          isVisible={isOverlayVisible}
          recentlyVisited={recentlyVisited}
        />
      )}


      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
