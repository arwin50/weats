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
}

interface MapSidebarProps {
  onLocationSelect: (location: LocationResult | null) => void;
  apiKey: string;
  selectedLocation?: LocationResult | null;
}

export default function MapSidebar({
  onLocationSelect,
  apiKey,
  selectedLocation,
}: MapSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLocationClick = (location: LocationResult) => {
    if (selectedLocation?.place_id === location.place_id) {
      onLocationSelect(null);
    } else {
      onLocationSelect(location);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative top-0 left-0 z-10 w-[300px] h-full bg-[#c8e6c9] rounded-[20px] p-4 flex flex-col border-2 border-[#b8d6b9] overflow-y-auto shadow-lg">
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search location"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-10 pl-10 pr-4 rounded-xl shadow-sm bg-white border border-gray-300 text-sm placeholder:text-gray-500 text-gray-800"
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>

      {/* Address Results */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {isLoading && (
          <div className="text-center py-4 text-sm text-gray-600">
            Searching...
          </div>
        )}

        {suggestions.map((location) => {
          const isSelected = selectedLocation?.place_id === location.place_id;

          return (
            <div
              key={location.place_id}
              onClick={() => handleLocationClick(location)}
              className={`rounded-[8px] p-3 cursor-pointer transition-colors ${
                isSelected
                  ? "bg-[#e8f5e8] border-2 border-[#5A9785] text-[#5A9785]"
                  : "bg-[#f5f5dc] hover:bg-[#ede8d0] text-black"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <MapPin
                    className="w-3 h-3"
                    fill={isSelected ? "#5A9785" : "black"}
                    stroke={isSelected ? "#5A9785" : "black"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight mb-1">
                    {location.structured_formatting.main_text}
                  </div>
                  <div
                    className={`text-xs leading-tight ${
                      isSelected ? "text-[#5A9785]" : "text-gray-600"
                    }`}
                  >
                    {location.structured_formatting.secondary_text}
                  </div>
                  {isSelected && (
                    <div className="text-xs font-medium mt-1">
                      ✓ Selected (click to unselect)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {!isLoading && suggestions.length === 0 && searchQuery && (
          <div className="text-center py-8 text-sm text-gray-600">
            No locations found
            <div className="text-xs text-gray-500 mt-1">
              Try a different search term
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
