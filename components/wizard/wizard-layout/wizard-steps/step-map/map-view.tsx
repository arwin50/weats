import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapViewProps {
  markerPosition: LatLng | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842,
};

export default function MapView({ markerPosition }: MapViewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={markerPosition || defaultCenter}
      zoom={markerPosition ? 15 : 12}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
}
