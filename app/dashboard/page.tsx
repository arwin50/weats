"use client";

import { useEffect, useState } from "react";
import { FoodMap, type MapMarker } from "@/components/map";
import { RestaurantListOverlay } from "@/components/RestaurantListOverlay";
import { PreviousPromptOverlay } from "@/components/PreviousPromptOverlay";
import { RecentlyVisitedOverlay } from "@/components/RecentlyVisitedOverlay";
import { RestaurantModal } from "@/components/RestaurantModal";
import { ChevronDown, ChevronRight } from "lucide-react";
import { authApi, publicApi } from "@/lib/redux/slices/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { FaBookOpen, FaMapMarkedAlt, FaUtensils, FaRedo } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { UserMenu } from "@/components/userMenu";
import { setPromptData } from "@/lib/redux/slices/promptSlice";

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isMobile;
}

export default function DashboardPage() {
  const promptData = useAppSelector((state) => state.prompt);
  const authData = useAppSelector((state) => state.auth);
  const [placeMarkers, setPlaceMarkers] = useState<MapMarker[]>([]);
  const [combinedMarkers, setCombinedMarkers] = useState<MapMarker[]>([]);
  const [center, setCenter] = useState(promptData.locationCoords);

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
  const isMobile = useIsMobile();

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
    const allMarkers = [...placeMarkers];

    // Add visited locations with a different style
    visitedLocations.forEach((visited) => {
      // Check if this location is already in placeMarkers
      const exists = placeMarkers.some((marker) => marker.id === visited.id);
      if (!exists) {
        allMarkers.push({
          ...visited,
          isVisited: true, // Add a flag to identify visited locations
        });
      }
    });

    // Update the combined markers
    setCombinedMarkers(allMarkers);
  }, [placeMarkers, visitedLocations]);

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
            console.log("Raw restaurant data:", response.data.restaurants);
            const markers: MapMarker[] = response.data.restaurants.map(
              (restaurant) => {
                console.log("Processing restaurant:", {
                  name: restaurant.name,
                  rank: restaurant.rank,
                  rankType: typeof restaurant.rank,
                });
                return {
                  id: restaurant.id?.toString() || "", // Ensure id is always a string
                  name: restaurant.name,
                  address: restaurant.address,
                  lat: restaurant.lat,
                  lng: restaurant.lng,
                  rating: restaurant.rating,
                  price_level: restaurant.price_level,
                  types: restaurant.types,
                  rank: Number(restaurant.rank), // Ensure rank is a number
                  photo_url: restaurant.photo_url,
                  isVisited: false, // Add flag for suggested locations
                };
              }
            );
            console.log("Processed markers:", markers);
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

  // Add this function to handle visited updates
  const handleVisitedUpdate = async () => {
    if (!authData.isAuthenticated) return;
    try {
      setIsLoadingVisited(true);
      const response = await authApi.get("/visited/");

      // Debug logging
      console.log("Visited locations response:", response.data);

      // Check if response data is an array
      if (!Array.isArray(response.data)) {
        console.log("Response data is not an array:", response.data);
        setVisitedLocations([]);
        return;
      }

      const locations: MapMarker[] = response.data.map((location: any) => ({
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
      }));
      console.log("Processed locations:", locations);
      setVisitedLocations(locations);
    } catch (error) {
      console.error("Error fetching visited locations:", error);
      setVisitedError("Failed to load visited locations");
      setVisitedLocations([]); // Set empty array on error
    } finally {
      setIsLoadingVisited(false);
    }
  };

  // Update the useEffect to use the new function
  useEffect(() => {
    if (authData.isAuthenticated) {
      handleVisitedUpdate();
    }
  }, [authData.isAuthenticated]);

  const handleSelectRestaurant = (restaurant: MapMarker) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);

    if (isMobile) {
      setIsOverlayVisible(false);
    }

    // Add to recently visited, avoiding duplicates
    setRecentlyVisited((prev) => {
      const exists = prev.find((r) => r.name === restaurant.name);
      if (exists) return prev;
      return [restaurant, ...prev].slice(0, 10); // limit to 10
    });
  };

  const toggleOverlayVisibility = () => {
    if (isModalOpen) {
      // If modal is open, close it and show overlays
      setIsModalOpen(false);
      setSelectedRestaurant(null);
      setIsOverlayVisible(true);
    } else {
      // Normal toggle behavior when modal is not open
      setIsOverlayVisible((prev) => !prev);
    }
  };

  const startWizard = () => {
    router.push("/startingWizard");
  };

  const handleSelectPreviousPrompt = (prompt: {
    locationCoords: { lat: number; lng: number };
    foodPreference: string;
    dietaryPreference: string;
    maxPrice?: number;
  }) => {
    setPromptData(prompt);
  };

  const handleSelectPreviousPromptLocations = (restaurants: MapMarker[]) => {
    setPlaceMarkers(restaurants);
    setActiveOverlay("restaurant");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);

    if (isMobile) {
      setIsOverlayVisible(true);
    }
  };

  const effectiveOverlayVisibility =
    isOverlayVisible && (!isMobile || !isModalOpen);

  return (
    <div>
      <UserMenu />
      <div className="fixed z-50 right-14">
        <Image
          src={logo || "/placeholder.svg"}
          alt="Logo"
          height={60}
          className="object-contain sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[130px] lg:h-[130px]"
        />
      </div>

      {/* Responsive button row - always visible */}
      <div className="fixed top-4 xs:top-6 sm:top-7 left-14 xs:left-18 sm:left-22 z-50 flex gap-1 sm:gap-2 md:gap-4 items-center w-auto max-w-[calc(100vw-200px)] sm:max-w-[calc(100vw-250px)] md:max-w-[calc(100vw-300px)] overflow-x-auto bg-transparent">
        {/* Recycle button */}
        <button
          onClick={startWizard}
          className="bg-[#C95C5C] hover:bg-[#b94a4a] text-gray-800 rounded-xl px-2 py-2 sm:px-3 sm:py-2 flex items-center justify-center shadow-md focus:outline-none text-sm sm:text-base md:text-lg flex-shrink-0"
          aria-label="Restart Wizard"
        >
          <FaRedo size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>

        {/* Toggle overlays button - shows state based on effective visibility */}
        <button
          onClick={toggleOverlayVisibility}
          className="bg-[#E0E0E0] hover:bg-[#cccccc] text-gray-800 rounded-xl px-2 py-2 sm:px-3 sm:py-2 flex items-center justify-center shadow-md focus:outline-none text-sm sm:text-base md:text-lg flex-shrink-0"
          aria-label="Toggle overlays"
        >
          {effectiveOverlayVisibility ? (
            <ChevronDown size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          ) : (
            <ChevronRight size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          )}
        </button>

        {/* Overlay action buttons, only visible when overlays are effectively ON */}
        {effectiveOverlayVisibility && (
          <>
            <button
              onClick={() => setActiveOverlay("restaurant")}
              className="bg-[#D5DBB5] hover:bg-[#BFC89E] text-gray-800 rounded-xl px-2 py-2 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-md focus:outline-none font-semibold text-sm sm:text-base md:text-lg flex-shrink-0"
            >
              <FaUtensils size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden lg:inline ml-1 sm:ml-2">Suggestions</span>
            </button>
            <button
              onClick={() => setActiveOverlay("previous")}
              className="bg-[#FFF396] hover:bg-[#e6e272] text-gray-800 rounded-xl px-2 py-2 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-md focus:outline-none font-semibold text-sm sm:text-base md:text-lg flex-shrink-0"
            >
              <FaBookOpen size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden lg:inline ml-1 sm:ml-2">
                View History
              </span>
            </button>
            <button
              onClick={() => setActiveOverlay("recently")}
              className="bg-[#B1A0C9] hover:bg-[#927EB0] text-gray-800 rounded-xl px-2 py-2 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-md focus:outline-none font-semibold text-sm sm:text-base md:text-lg flex-shrink-0"
            >
              <FaMapMarkedAlt
                size={16}
                className="sm:w-5 sm:h-5 md:w-6 md:h-6"
              />
              <span className="hidden lg:inline ml-1 sm:ml-2">
                Recently Visited
              </span>
            </button>
          </>
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-[#5A9785] mx-auto mb-4"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Finding the best restaurants...
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Please wait while we search for amazing places near you
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
            <div className="text-red-500 text-3xl sm:text-4xl mb-4">⚠️</div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#5A9785] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#48796B] transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      <FoodMap markers={combinedMarkers} center={center!} />

      {/* Overlays - only visible when effectively on (not when modal is open) */}
      {effectiveOverlayVisibility && activeOverlay === "restaurant" && (
        <RestaurantListOverlay
          restaurants={placeMarkers}
          onSelectRestaurant={handleSelectRestaurant}
          isVisible={activeOverlay === "restaurant"}
          preferences={promptData}
        />
      )}
      {effectiveOverlayVisibility && activeOverlay === "previous" && (
        <PreviousPromptOverlay
          isVisible={activeOverlay === "previous"}
          onSelectPrompt={handleSelectPreviousPrompt}
          handleSelectPreviousPromptLocations={
            handleSelectPreviousPromptLocations
          }
        />
      )}
      {effectiveOverlayVisibility && activeOverlay === "recently" && (
        <RecentlyVisitedOverlay
          isVisible={effectiveOverlayVisibility}
          recentlyVisited={visitedLocations}
          onSelectRestaurant={handleSelectRestaurant}
          isLoading={isLoadingVisited}
          error={visitedError}
        />
      )}

      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onVisitedUpdate={handleVisitedUpdate}
      />
    </div>
  );
}
