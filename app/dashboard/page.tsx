"use client";

import { useEffect, useState } from "react";
import { FoodMap, MapMarker } from "@/components/map";
import { RestaurantListOverlay } from "@/components/RestaurantListOverlay";
import { PreviousPromptOverlay } from "@/components/PreviousPromptOverlay";
import { RecentlyVisitedOverlay } from "@/components/RecentlyVisitedOverlay";
import { RestaurantModal } from "@/components/RestaurantModal";
import { Eye, EyeOff, Book, MapPin, Star } from "lucide-react";
import { api, markAppAsUsed } from "@/lib/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

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

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const promptData = useAppSelector((state) => state.prompt);
  const authData = useAppSelector((state) => state.auth);
  const [placeMarkers, setPlaceMarkers] = useState<MapMarker[]>([]);
  const [center, setCenter] = useState({ lat: 10.3157, lng: 123.8854 });
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<MapMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState<
    "restaurant" | "previous" | "recently" | null
  >("restaurant");
  const [recentlyVisited, setRecentlyVisited] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mark the app as used when the dashboard is loaded
    dispatch(markAppAsUsed());
  }, [dispatch]);

  useEffect(() => {
    // Log user data
    console.log("Auth State:", {
      isAuthenticated: authData.isAuthenticated,
      user: authData.user,
      accessToken: authData.accessToken ? "Present" : "Not Present",
      refreshToken: authData.refreshToken ? "Present" : "Not Present",
    });
  }, [authData]);

  useEffect(() => {
    // Set center from Redux state
    if (promptData.locationCoords) {
      setCenter(promptData.locationCoords);
    }
  }, [promptData.locationCoords]);

  useEffect(() => {
    // Fetch restaurants only when wizard is completed
    const fetchRestaurants = async () => {
      if (
        promptData.wizardCompleted &&
        promptData.foodPreference &&
        promptData.dietaryPreference
      ) {
        try {
          // Clear previous data
          setPlaceMarkers([]);
          setSelectedRestaurant(null);
          setIsModalOpen(false);
          setIsLoading(true);
          setError(null);

          const response = await api.post<ApiResponse>("/maps/search_places/", {
            lat: promptData.locationCoords?.lat || 10.3157,
            lng: promptData.locationCoords?.lng || 123.8854,
            preferences: {
              food_preference: promptData.foodPreference,
              dietary_preference: promptData.dietaryPreference,
              price: promptData.maxPrice,
            },
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
          // Clear data on error
          setPlaceMarkers([]);
          setSelectedRestaurant(null);
          setIsModalOpen(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRestaurants();
  }, [promptData.wizardCompleted]);

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
        onClick={toggleOverlayVisibility}
        className="fixed top-2 left-2 z-50 bg-[#C2C8A4] p-2 rounded shadow text-black hover:bg-[#B0B68F] transition"
      >
        {isOverlayVisible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>

      {isOverlayVisible && (
        <div className="fixed z-40 flex flex-row md:flex-col items-center md:items-end gap-3 px-2 md:px-0 md:left-10s0 md:top-20 transform translate-x-1/2 md:translate-x-0">
          <div
            onClick={() => setActiveOverlay("restaurant")}
            className="w-14 h-14 md:w-30 md:h-20 bg-[#D5DBB5] rounded-full flex items-center justify-center hover:bg-[#BFC59A] cursor-pointer transition"
          >
            <Book size={28} className="text-green-900 md:size-8 ml-7" />
          </div>
          <div
            onClick={() => setActiveOverlay("recently")}
            className="w-14 h-14 md:w-30 md:h-20 bg-[#FFF396] rounded-full flex items-center justify-center hover:bg-[#E6E272] cursor-pointer transition"
          >
            <MapPin size={28} className="text-green-900 md:size-8 ml-7" />
          </div>
          <div
            onClick={() => setActiveOverlay("previous")}
            className="w-14 h-14 md:w-30 md:h-20 bg-[#FF9268] rounded-full flex items-center justify-center hover:bg-[#E57E56] cursor-pointer transition"
          >
            <Star size={28} className="text-green-900 md:size-8 ml-7" />
          </div>
        </div>
      )}

      {activeOverlay === "restaurant" && (
        <RestaurantListOverlay
          restaurants={placeMarkers}
          onSelectRestaurant={handleSelectRestaurant}
          isVisible={isOverlayVisible}
          preferences={promptData}
        />
      )}
      {activeOverlay === "previous" && (
        <PreviousPromptOverlay isVisible={isOverlayVisible} />
      )}
      {activeOverlay === "recently" && (
        <RecentlyVisitedOverlay
          isVisible={isOverlayVisible}
          recentlyVisited={recentlyVisited}
          onSelectRestaurant={function (restaurant: MapMarker): void {
            throw new Error("Function not implemented.");
          }}
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
