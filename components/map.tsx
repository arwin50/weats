"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { RestaurantModal } from "./RestaurantModal";

const containerStyle = {
  width: "100%",
  height: "800px",
};

const getMarkerSymbol = (color: string, scale: number = 10) => {
  if (typeof google === "undefined") return undefined;
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale,
  };
};

export interface MapMarker {
  id: string;
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

interface MapProps {
  markers: MapMarker[];
  center: { lat: number; lng: number };
}

export const FoodMap = ({ markers, center }: MapProps) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<MapMarker | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [travelInfo, setTravelInfo] = useState<{
    distanceText: string;
    durationText: string;
  } | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { isLoaded: googleMapsIsLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    // Check if Google Maps is loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
    } else {
      // If not loaded, set up a listener for when it loads
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          clearInterval(checkGoogleMaps);
        }
      }, 100);

      // Cleanup interval
      return () => clearInterval(checkGoogleMaps);
    }
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedRestaurant(marker);
    const destination = { lat: marker.lat, lng: marker.lng };

    if (mapRef.current) {
      mapRef.current.panTo(destination);
    }
  };

  const getMarkerStyle = (marker: MapMarker) => {
    let color = "#E26F43"; // default
    if (marker.rating && marker.rating >= 4.5) color = "#4CAF50";
    else if (marker.price_level && marker.price_level >= 3) color = "#9C27B0";

    const scale = marker.rank ? Math.max(10, 14 - marker.rank * 0.5) : 10;
    return getMarkerSymbol(color, scale);
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A9785]"></div>
      </div>
    );
  }

  if (loadError) return <div>Error loading maps</div>;

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
        onLoad={onMapLoad}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          zoomControl: true,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        <Marker
          position={mapCenter}
          icon={getMarkerSymbol("#4285F4", 10)}
          zIndex={1000}
        />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.name}
            onClick={() => handleMarkerClick(marker)}
            icon={getMarkerStyle(marker)}
            label={{
              text: marker.rank?.toString() || "",
              color: "#ffffff",
              fontSize: marker.rank
                ? `${Math.max(14, 18 - marker.rank)}px`
                : "14px",
              fontWeight: "bold",
            }}
          />
        ))}

        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{ strokeColor: "#4285F4", strokeWeight: 5 }}
          />
        )}
      </GoogleMap>

      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={!!selectedRestaurant}
        onClose={() => {
          setSelectedRestaurant(null);
          setRoutePath([]);
          setTravelInfo(null);
        }}
        travelInfo={travelInfo}
      />
    </div>
  );
};
