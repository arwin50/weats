"use client";

import { useEffect, useState } from "react";
import { FoodMap, MapMarker } from "@/components/map";
import { RestaurantListOverlay } from "@/components/RestaurantListOverlay";
import { PreviousPromptOverlay } from "@/components/PreviousPromptOverlay";
import { RecentlyVisitedOverlay } from "@/components/RecentlyVisitedOverlay";
import { RestaurantModal } from "@/components/RestaurantModal";
import { Eye, EyeOff } from "lucide-react";
import { authApi, publicApi } from "@/lib/redux/slices/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { FaRedo } from "react-icons/fa";
import { FaBookOpen, FaMapMarkedAlt, FaUtensils } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { UserMenu } from "@/components/userMenu";

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
  id?: string;
}

interface ApiResponse {
  restaurants: Restaurant[];
  count: number;
}

export default function DashboardPage() {
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
  const [visitedLocations, setVisitedLocations] = useState<MapMarker[]>([]);
  const [isLoadingVisited, setIsLoadingVisited] = useState(false);
  const [visitedError, setVisitedError] = useState<string | null>(null);
  const router = useRouter();

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

          const response = await publicApi.post<ApiResponse>(
            "/maps/search_places/",
            {
              lat: promptData.locationCoords?.lat || 10.3157,
              lng: promptData.locationCoords?.lng || 123.8854,
              preferences: {
                food_preference: promptData.foodPreference,
                dietary_preference: promptData.dietaryPreference,
                max_price: promptData.maxPrice,
              },
            }
          );

          if (response.data.restaurants) {
            const markers: MapMarker[] = response.data.restaurants.map(
              (restaurant) => ({
                id: restaurant.id,
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
        } catch (error: any) {
          // Log the full error object
          console.error("Full error object:", error);

          // Log specific error properties
          console.error("Error details:", {
            message: error?.message,
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            config: {
              url: error?.config?.url,
              method: error?.config?.method,
              data: error?.config?.data,
            },
          });

          // Validate required data before showing error
          const missingData = [];
          if (!promptData.foodPreference) missingData.push("Food Preference");
          if (!promptData.dietaryPreference)
            missingData.push("Dietary Preference");
          if (!promptData.locationCoords) missingData.push("Location");

          let errorMessage = "Failed to fetch restaurants. ";
          if (missingData.length > 0) {
            errorMessage += `Missing required data: ${missingData.join(", ")}`;
          } else if (error?.response?.data?.detail) {
            errorMessage += error.response.data.detail;
          } else if (error?.response?.data?.message) {
            errorMessage += error.response.data.message;
          } else if (error?.message) {
            errorMessage += error.message;
          } else {
            errorMessage += "Please try again.";
          }

          setError(errorMessage);

          // Clear data on error
          setPlaceMarkers([]);
          setSelectedRestaurant(null);
          setIsModalOpen(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Add a flag to prevent double calls
    let isMounted = true;

    if (isMounted) {
      fetchRestaurants();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [
    promptData.wizardCompleted,
    promptData.foodPreference,
    promptData.dietaryPreference,
    promptData.locationCoords,
    promptData.maxPrice,
  ]);

  useEffect(() => {
    const fetchVisitedLocations = async () => {
      try {
        setIsLoadingVisited(true);
        const response = await authApi.get("/visited/");
        const locations: MapMarker[] = response.data.visited_locations.map(
          (location: any) => ({
            id: location.id?.toString() || "", // Ensure id is always a string
            name: location.name || "",
            address: location.address || "",
            lat: location.lat || 0,
            lng: location.lng || 0,
            rating: location.rating,
            user_ratings_total: location.user_ratings_total,
            price_level: location.price_level,
            types: location.types || [],
            description: location.description,
            recommendation_reason: location.recommendation_reason,
            photo_url: location.photo_url,
          })
        );
        setVisitedLocations(locations);
      } catch (error) {
        console.error("Error fetching visited locations:", error);
        setVisitedError("Failed to load visited locations");
      } finally {
        setIsLoadingVisited(false);
      }
    };

    if (authData.isAuthenticated) {
      fetchVisitedLocations();
    }
  }, [authData.isAuthenticated]);

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

  const startWizard = () => {
    router.push("/startingWizard");
  };

  return (
    <div>
      <UserMenu />
      <div className="fixed top-3 z-50 right-3 sm:top-4 sm:right-4 md:top-4 md:right-8">
        <Image
          src={logo || "/placeholder.svg"}
          alt="Logo"
          height={80}
          className="object-contain sm:w-[100px] sm:h-[100px] md:w-[130px] md:h-[130px]"
        />
      </div>
      {/* Responsive button row at top left */}
      <div className="fixed top-7 left-20 z-50 flex gap-2 sm:gap-4 items-center px-2 sm:px-6 py-2 w-full max-w-full overflow-x-auto bg-transparent">
        {/* Recycle button */}
        <button
          onClick={startWizard}
          className="bg-[#C95C5C] hover:bg-[#b94a4a] text-white rounded-xl px-3 py-2 flex items-center justify-center shadow-md focus:outline-none text-base sm:text-lg"
          aria-label="Restart Wizard"
        >
          <FaRedo size={22} />
        </button>
        {/* Toggle overlays button */}
        <button
          onClick={() => setIsOverlayVisible((v) => !v)}
          className="bg-[#E0E0E0] hover:bg-[#cccccc] text-black rounded-xl px-3 py-2 flex items-center justify-center shadow-md focus:outline-none text-base sm:text-lg"
          aria-label="Toggle overlays"
        >
          {isOverlayVisible ? <Eye size={22} /> : <EyeOff size={22} />}
        </button>
        {/* Overlay action buttons, only visible when overlays are ON */}
        {isOverlayVisible && (
          <>
            <button
              onClick={() => setActiveOverlay("restaurant")}
              className="bg-[#D5DBB5] hover:bg-[#BFC89E] text-black rounded-xl px-3 py-2 flex items-center gap-1 sm:gap-2 shadow-md focus:outline-none font-semibold text-base sm:text-lg"
            >
              <FaUtensils size={22} />
              <span className="hidden sm:inline ml-2">Suggestions</span>
            </button>
            <button
              onClick={() => setActiveOverlay("previous")}
              className="bg-[#FFF396] hover:bg-[#e6e272] text-black rounded-xl px-3 py-2 flex items-center gap-1 sm:gap-2 shadow-md focus:outline-none font-semibold text-base sm:text-lg"
            >
              <FaBookOpen size={22} />
              <span className="hidden sm:inline ml-2">View History</span>
            </button>
            <button
              onClick={() => setActiveOverlay("recently")}
              className="bg-[#B1A0C9] hover:bg-[#927EB0] text-black rounded-xl px-3 py-2 flex items-center gap-1 sm:gap-2 shadow-md focus:outline-none font-semibold text-base sm:text-lg"
            >
              <FaMapMarkedAlt size={22} />
              <span className="hidden sm:inline ml-2">Recently Visited</span>
            </button>
          </>
        )}
      </div>

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

      {isOverlayVisible && activeOverlay === "restaurant" && (
        <RestaurantListOverlay
          restaurants={placeMarkers}
          onSelectRestaurant={handleSelectRestaurant}
          isVisible={activeOverlay === "restaurant"}
          preferences={promptData}
        />
      )}
      {isOverlayVisible && activeOverlay === "previous" && (
        <PreviousPromptOverlay isVisible={activeOverlay === "previous"} />
      )}
      {isOverlayVisible && activeOverlay === "recently" && (
        <RecentlyVisitedOverlay
          isVisible={isOverlayVisible}
          recentlyVisited={visitedLocations}
          onSelectRestaurant={handleSelectRestaurant}
          isLoading={isLoadingVisited}
          error={visitedError}
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
