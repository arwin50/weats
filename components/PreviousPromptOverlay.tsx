"use client";

import type { MapMarker } from "./map";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { authApi } from "@/lib/redux/slices/authSlice";

interface PreviousPromptOverlayProps {
  isVisible: boolean;
  onSelectPrompt: (prompt: {
    locationCoords: { lat: number; lng: number };
    foodPreference: string;
    dietaryPreference: string;
    maxPrice?: number;
  }) => void;
  handleSelectPreviousPromptLocations: (restaurants: MapMarker[]) => void;
}

export function PreviousPromptOverlay({
  isVisible,
  onSelectPrompt,
  handleSelectPreviousPromptLocations,
}: PreviousPromptOverlayProps) {
  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !isAuthenticated) return;

    const fetchUserSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await authApi.get("/suggestions/user_suggestions/");
        setSuggestions(response.data);
      } catch (err: any) {
        setError("Failed to load suggestions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSuggestions();
  }, [isAuthenticated, hasMounted]);

  if (!hasMounted) return null;

  return (
    <>
      <div
        className={`fixed left-0 top-20 sm:top-24 md:top-28 h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[400px] xl:w-[450px] bg-[#FFF396] border-4 sm:border-8 border-[#FFF396] transform transition-transform duration-300 ease-in-out flex flex-col items-center rounded-r-3xl ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-3 sm:px-4 md:px-6 py-3 w-full">
          <h2 className="text-gray-800 text-lg sm:text-xl font-playfair font-bold mb-3 sm:mb-4">
            Previous Prompts
          </h2>
          <p className="text-gray-800 text-sm sm:text-base">
            This is where your previous prompt content will go.
          </p>
        </div>

        <div className="w-full h-full overflow-y-auto px-2 sm:px-4 z-40 rounded-r-xl custom-scrollbar mb-4 sm:mb-6">
          {loading && (
            <p className="text-gray-800 text-sm sm:text-base p-4">
              Loading suggestions...
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm sm:text-base p-4">{error}</p>
          )}
          {!loading && !error && suggestions.length === 0 && (
            <p className="text-sm sm:text-base p-4">No suggestions yet.</p>
          )}

          {suggestions.map((suggestion: any) => (
            <div
              key={suggestion.id}
              className="flex flex-col w-full bg-white p-3 sm:p-4 rounded-xl shadow border border-gray-300 mb-3 sm:mb-4 cursor-pointer hover:opacity-75 transition-opacity"
              onClick={() => {
                onSelectPrompt({
                  locationCoords: {
                    lat: suggestion.prompt.lat,
                    lng: suggestion.prompt.lng,
                  },
                  foodPreference: suggestion.prompt.foodPreference,
                  dietaryPreference: suggestion.prompt.dietaryPreference,
                  maxPrice: suggestion.prompt.maxPrice,
                });
                handleSelectPreviousPromptLocations(suggestion.locations);
              }}
            >
              <p className="text-xs sm:text-sm text-gray-800 mb-2">
                <strong>Date:</strong>{" "}
                {new Date(suggestion.date_created).toLocaleString()}
              </p>

              <p className="text-gray-800 mb-1 text-sm sm:text-base">
                <strong>Price:</strong> {suggestion.prompt.price}
              </p>
              <p className="text-gray-800 mb-1 text-sm sm:text-base">
                <strong>Food Preference:</strong>{" "}
                {suggestion.prompt.food_preference}
              </p>
              <p className="text-gray-800 mb-1 text-sm sm:text-base">
                <strong>Dietary Preference:</strong>{" "}
                {suggestion.prompt.dietary_preference}
              </p>

              <p className="text-xs sm:text-sm text-gray-800 mt-2">
                <strong>Prompt Location:</strong>{" "}
                <a
                  href={`https://www.google.com/maps?q=${suggestion.prompt.lat},${suggestion.prompt.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {suggestion.prompt.lat.toFixed(5)},{" "}
                  {suggestion.prompt.lng.toFixed(5)}
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
