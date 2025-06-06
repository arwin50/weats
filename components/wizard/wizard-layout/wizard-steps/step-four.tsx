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

  const handleLocationSelect = async (location: LocationResult | null) => {
    console.log("handleLocationSelect called with:", location);
    setSelectedLocation(location);
    setHasChosenLocation(!!location);

    if (!location) {
      setMarkerPosition(null);
      updateFormData({ locationCoords: undefined });
      return;
    }

    try {
      console.log("Fetching place details for place_id:", location.place_id);

      const response = await fetch(
        `https://places.googleapis.com/v1/places/${location.place_id}?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&fields=location`
      );

      console.log("Fetch response status:", response.status);

      const data = await response.json();
      console.log("Place details API response:", data);

      const loc = data.location;

      if (loc) {
        const coords = { lat: loc.latitude, lng: loc.longitude };
        setMarkerPosition(coords);
        updateFormData({ locationCoords: coords });
      }
    } catch (err) {
      console.error("Error fetching place details:", err);
    }
  };

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
        nextButtonText="Choosee"
        nextButtonDisabled={!hasChosenLocation}
        wide={true}
      >
        <div className="flex gap-6 items-center h-[60vh]">
          {/* Sidebar */}
          <div className="h-full w-[300px]">
            <MapSidebar
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
              selectedLocation={selectedLocation}
              onLocationSelect={(location) => {
                console.log(
                  "MapSidebar called onLocationSelect with:",
                  location
                );
                handleLocationSelect(location);
              }}
            />
          </div>
          -{/* Map */}
          <div className="h-full w-[60vw] rounded-2xl overflow-hidden shadow-2xl">
            <MapView markerPosition={markerPosition} />
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
      nextButtonText="Choosee"
      nextButtonDisabled={!hasChosenLocation}
    >
      <div className="flex justify-center mb-6">
        <button
          onClick={handleLocationToggle}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-medium transition-colors cursor-pointer shadow-md/20 ${
            formData.locationEnabled
              ? "bg-[#D9D9D9] hover:bg-[#989898] text-black"
              : "bg-[#5A9785] hover:bg-teal-600 text-white"
          }`}
        >
          <MapPin className="w-5 h-5" />
          {formData.locationEnabled ? "Location Enabled" : "Enable location"}
        </button>
      </div>
    </WizardStepLayout>
  );
}
