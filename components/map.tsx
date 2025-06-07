"use client";

import React, { useState, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { RestaurantModal } from "./RestaurantModal";
import { LoadingSpinner } from "./LoadingSpinner";

// Container style for the map div
const containerStyle = {
  width: "100%",
  height: "800px",
};

export interface MapMarker {
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
}

type centerType = {
  lat: number;
  lng: number;
};

interface MapProps {
  markers: MapMarker[];
  center: centerType;
}

export const FoodMap = ({ markers, center }: MapProps) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<MapMarker | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const mapRef = React.useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedRestaurant(marker);

    // Center map on clicked marker
    setMapCenter({ lat: marker.lat, lng: marker.lng });
    if (mapRef.current) {
      mapRef.current.panTo({ lat: marker.lat, lng: marker.lng });
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onLoad={onMapLoad}
        options={{
          fullscreenControl: false, // ✅ disables fullscreen button
          mapTypeControl: false, // (optional) disables Map/Satellite toggle
          zoomControl: true, // (optional) keep this true if you still want zoom
          streetViewControl: false, // (optional) hides Pegman/street view icon
        }}
      >
        {/* Center marker */}
        <Marker
          position={mapCenter}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 0.7,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
          zIndex={1000}
        />

        {/* Restaurant markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.name}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
      </GoogleMap>

      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />
    </div>
  );
};
