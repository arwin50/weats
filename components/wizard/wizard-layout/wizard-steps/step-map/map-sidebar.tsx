"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Search, MapPin } from "lucide-react";

interface LocationResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  locationCoords?: { lat: number; lng: number };
}

interface MapSidebarProps {
  onLocationSelect: (location: LocationResult | null) => void;
  apiKey: string;
  selectedLocation?: LocationResult | null;
  markerPosition?: { lat: number; lng: number } | null;
  isSelectingFromSuggestion?: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function MapSidebar({
  onLocationSelect,
  apiKey,
  selectedLocation,
  markerPosition,
  setSearchQuery,
  searchQuery,
  isSelectingFromSuggestion = false,
}: MapSidebarProps) {
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [markerSuggestion, setMarkerSuggestion] =
    useState<LocationResult | null>(null);

  const searchLocations = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places:searchText`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask":
                "places.id,places.displayName,places.formattedAddress,places.location",
            },
            body: JSON.stringify({
              textQuery: query,
              maxResultCount: 5,
              locationBias: {
                circle: {
                  center: {
                    latitude: 14.5995,
                    longitude: 120.9842,
                  },
                  radius: 50000.0,
                },
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.places) {
          const formattedResults: LocationResult[] = data.places.map(
            (place: any) => ({
              place_id: place.id,
              description:
                place.formattedAddress || place.displayName?.text || "",
              structured_formatting: {
                main_text: place.displayName?.text || "Unknown Location",
                secondary_text: place.formattedAddress || "",
              },
            })
          );

          setSuggestions(formattedResults);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error searching locations:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchLocations]);

  useEffect(() => {
    if (!markerPosition) return;

    if (isSelectingFromSuggestion || selectedLocation) return;

    const reverseGeocode = async () => {
      try {
        const { lat, lng } = markerPosition;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );

        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const result = data.results[0];
          const locationResult: LocationResult = {
            place_id: result.place_id,
            description: result.formatted_address,
            structured_formatting: {
              main_text:
                result.address_components?.[0]?.long_name || "Dropped Pin",
              secondary_text: result.formatted_address,
            },
            locationCoords: {
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng,
            },
          };

          console.log("Reverse geocoded location:", locationResult);

          setMarkerSuggestion(locationResult);
          setShowMarkerSuggestion(true);
        } else {
          console.warn("Geocoding failed", data);
        }
      } catch (err) {
        console.error("Error during reverse geocoding:", err);
      }
    };

    reverseGeocode();
  }, [markerPosition, apiKey, isSelectingFromSuggestion]);

  const handleLocationClick = (location: LocationResult) => {
    if (selectedLocation?.place_id === location.place_id) {
      onLocationSelect(null);
    } else {
      onLocationSelect(location);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowMarkerSuggestion(false); // Hide marker suggestion while typing
  };

  const [showMarkerSuggestion, setShowMarkerSuggestion] = useState(false);

  function onSearchChange(value: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="w-full h-full bg-[#c8e6c9] rounded-[20px] p-3 sm:p-4 flex flex-col border-2 border-[#b8d6b9] overflow-hidden shadow-lg">
      {/* Search Input */}
      <div className="mb-3 sm:mb-4 flex-shrink-0">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search location"
            value={isSelectingFromSuggestion ? searchQuery : searchQuery}
            onChange={handleSearchChange}
            className="w-full h-10 sm:h-12 pl-10 pr-4 rounded-xl shadow-sm bg-white border border-gray-300 text-sm placeholder:text-gray-500 text-gray-800 touch-manipulation"
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>

      {/* Address Results */}
      <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto min-h-0">
        {isLoading && (
          <div className="text-center py-4 text-sm text-gray-600">
            Searching...
          </div>
        )}

        {/* Show markerSuggestion first */}
        {showMarkerSuggestion && markerSuggestion && (
          <div
            key={`marker-${markerSuggestion.place_id}`}
            onClick={() => handleLocationClick(markerSuggestion)}
            className={`rounded-[8px] p-3 sm:p-4 cursor-pointer transition-colors touch-manipulation active:scale-95 ${
              selectedLocation?.place_id === markerSuggestion.place_id
                ? "bg-[#e8f5e8] border-2 border-[#5A9785] text-[#5A9785]"
                : "bg-[#f5f5dc] hover:bg-[#ede8d0] active:bg-[#e6e1c8] text-black"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <MapPin
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill={
                    selectedLocation?.place_id === markerSuggestion.place_id
                      ? "#5A9785"
                      : "black"
                  }
                  stroke={
                    selectedLocation?.place_id === markerSuggestion.place_id
                      ? "#5A9785"
                      : "black"
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base leading-tight mb-1 break-words font-playfair">
                  {markerSuggestion.structured_formatting.main_text}
                </div>
                <div
                  className={`text-xs sm:text-sm leading-tight break-words ${
                    selectedLocation?.place_id === markerSuggestion.place_id
                      ? "text-[#5A9785]"
                      : "text-gray-600"
                  }`}
                >
                  {markerSuggestion.structured_formatting.secondary_text}
                </div>
                {/* Add selected indicator here */}
                {selectedLocation?.place_id === markerSuggestion.place_id && (
                  <div className="text-xs font-medium mt-1 text-[#5A9785]">
                    ✓ Selected (tap to unselect)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Then show search-based suggestions */}
        {suggestions.map((location) => {
          const isSelected = selectedLocation?.place_id === location.place_id;

          return (
            <div
              key={location.place_id}
              onClick={() => handleLocationClick(location)}
              className={`rounded-[8px] p-3 sm:p-4 cursor-pointer transition-colors touch-manipulation active:scale-95 ${
                isSelected
                  ? "bg-[#e8f5e8] border-2 border-[#5A9785] text-[#5A9785]"
                  : "bg-[#f5f5dc] hover:bg-[#ede8d0] active:bg-[#e6e1c8] text-black"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <MapPin
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill={isSelected ? "#5A9785" : "black"}
                    stroke={isSelected ? "#5A9785" : "black"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base leading-tight mb-1 break-words font-playfair">
                    {location.structured_formatting.main_text}
                  </div>
                  <div
                    className={`text-xs sm:text-sm leading-tight break-words ${
                      isSelected ? "text-[#5A9785]" : "text-gray-600"
                    }`}
                  >
                    {location.structured_formatting.secondary_text}
                  </div>
                  {isSelected && (
                    <div className="text-xs font-medium mt-1 text-[#5A9785]">
                      ✓ Selected (tap to unselect)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
