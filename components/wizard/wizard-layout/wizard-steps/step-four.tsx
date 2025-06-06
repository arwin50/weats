"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import WizardStepLayout from "../wizard-step-layout";
import MapView from "./step-map/map-view";
import MapSidebar from "./step-map/map-sidebar";

interface FormData {
  maxPrice: number;
  foodPreference: string;
  dietaryPreference: string;
  locationEnabled: boolean;
  locationCoords?: { lat: number; lng: number };
}

interface LocationResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface StepFourProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFour({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepFourProps) {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [hasChosenLocation, setHasChosenLocation] = useState(false);

  useEffect(() => {
    if (showMap && !markerPosition) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setMarkerPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting device location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [showMap, markerPosition]);

  useEffect(() => {
    if (formData.locationEnabled) {
      setShowMap(true);
    }
  }, [formData.locationEnabled]);

  const handleLocationToggle = () => {
    const newState = !formData.locationEnabled;
    updateFormData({ locationEnabled: newState });

    if (newState) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setMarkerPosition(coords);
            updateFormData({ locationCoords: coords });
          },
          (error) => {
            console.error("Error getting device location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } else {
      updateFormData({ locationCoords: undefined });
      setMarkerPosition(null);
    }
  };
  const [isSelectingFromSuggestion, setIsSelectingFromSuggestion] =
    useState(false);

  const [lastSelectedCoords, setLastSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocationSelect = async (location: LocationResult | null) => {
    setIsSelectingFromSuggestion(true);
    setSelectedLocation(location);
    setHasChosenLocation(!!location);

    if (!location) {
      setMarkerPosition(null);
      updateFormData({ locationCoords: undefined });
      setSearchQuery(""); // Clear search
      setIsSelectingFromSuggestion(false); // Immediately reset
      return;
    }

    setSearchQuery(
      location.structured_formatting.main_text || location.description
    );

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${location.place_id}?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&fields=location`
      );
      const data = await response.json();
      const loc = data.location;

      if (loc) {
        const coords = { lat: loc.latitude, lng: loc.longitude };
        setMarkerPosition(coords);
        updateFormData({ locationCoords: coords });
      }
    } catch (err) {
      console.error("Error fetching place details:", err);
    } finally {
      setIsSelectingFromSuggestion(false); // Reset AFTER everything
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  // Renders the MAP view inside StepFour
  if (showMap) {
    return (
      <WizardStepLayout
        title="Almost here! We just need one last thing from you..."
        subtitle="Just pick a location, we'll handle the rest!"
        onBack={() => setShowMap(false)}
        onNext={() => {
          if (hasChosenLocation) {
            onNext();
          }
        }}
        showBackButton={true}
        nextButtonText="Choose"
        nextButtonDisabled={!hasChosenLocation}
        wide={true}
      >
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[70vh] lg:h-[60vh]">
          {/* Sidebar - Full width on mobile, fixed width on desktop */}
          <div className="w-full lg:w-80 xl:w-96 h-64 lg:h-full order-2 lg:order-1">
            <MapSidebar
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
              selectedLocation={selectedLocation}
              markerPosition={markerPosition}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSelectingFromSuggestion={isSelectingFromSuggestion}
              onLocationSelect={(location) => {
                handleLocationSelect(location);
              }}
            />
          </div>

          {/* Map - Full width on mobile, flexible on desktop */}
          <div className="flex-1 h-64 lg:h-full rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-2 min-h-[250px]">
            <MapView
              markerPosition={markerPosition}
              onMarkerDragEnd={async (coords) => {
                setMarkerPosition(coords);
                updateFormData({ locationCoords: coords });

                setSelectedLocation(null);
                setHasChosenLocation(true);
                setSearchQuery("");
              }}
            />
          </div>
        </div>
      </WizardStepLayout>
    );
  }

  // Normal StepFour layout
  return (
    <WizardStepLayout
      title="Almost here! We just need one last thing from you..."
      subtitle="Just pick a location, we'll handle the rest!"
      onBack={() => setShowMap(false)}
      onNext={() => {
        if (hasChosenLocation) {
          onNext();
        }
      }}
      showBackButton={true}
      nextButtonText="Choose"
      nextButtonDisabled={!hasChosenLocation}
    >
      <div className="flex justify-center mb-6">
        <button
          onClick={handleLocationToggle}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg text-base sm:text-lg font-medium transition-colors cursor-pointer shadow-md/20 touch-manipulation ${
            formData.locationEnabled
              ? "bg-[#D9D9D9] hover:bg-[#989898] text-black"
              : "bg-[#5A9785] hover:bg-teal-600 text-white"
          }`}
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">
            {formData.locationEnabled ? "Location Enabled" : "Enable location"}
          </span>
        </button>
      </div>
    </WizardStepLayout>
  );
}
