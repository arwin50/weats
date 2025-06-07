"use client";

import React, { useEffect, useState } from "react";
import { FoodMap, MapMarker } from "@/components/map";
import { RestaurantListOverlay } from "@/components/RestaurantListOverlay";
import { RestaurantModal } from "@/components/RestaurantModal";
import { Eye, EyeOff } from "lucide-react";
import { api, markAppAsUsed } from "@/lib/redux/slices/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

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
  photo_url?: string;
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
  const dispatch = useAppDispatch();
  const [placeMarkers, setPlaceMarkers] = useState<MapMarker[]>([]);
  const [center, setCenter] = useState({ lat: 10.3157, lng: 123.8854 });
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<MapMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [preferences, setPreferences] = useState<WizardPreferences | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mark the app as used when the dashboard is loaded
    dispatch(markAppAsUsed());
  }, [dispatch]);

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
          // Clear previous data
          setPlaceMarkers([]);
          setSelectedRestaurant(null);
          setIsModalOpen(false);
          setIsLoading(true);
          setError(null);

          const response = await api.post<ApiResponse>("/maps/search_places/", {
            lat: preferences.lat,
            lng: preferences.lng,
            preferences: preferences.preferences,
          });

          if (response.data.restaurants) {
            const markers: MapMarker[] = response.data.restaurants.map(
              (restaurant) => ({
                id: restaurant.name,
                name: restaurant.name,
                address: restaurant.address,
                lat: restaurant.lat,
                lng: restaurant.lng,
                rating: restaurant.rating,
                price_level: restaurant.price_level,
                types: restaurant.types,
                rank: restaurant.rank,
                photo_url: restaurant.photo_url,
              })
            );
            setPlaceMarkers(markers);
          }
        } catch (error) {
          console.error("Error fetching restaurants:", error);
          setError("Failed to fetch restaurants. Please try again.");
          setPlaceMarkers([]);
          setSelectedRestaurant(null);
          setIsModalOpen(false);
        } finally {
          setIsLoading(false);
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
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5A9785] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Finding the best restaurants...
            </h2>
            <p className="text-gray-600">
              Please wait while we search for amazing places near you
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#5A9785] text-white px-6 py-2 rounded-full hover:bg-[#48796B] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

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
