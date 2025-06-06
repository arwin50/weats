import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapViewProps {
  markerPosition: LatLng | null;
  onMarkerDragEnd?: (coords: LatLng) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842,
};

export default function MapView({
  markerPosition,
  onMarkerDragEnd,
}: MapViewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-2xl">
        <div className="text-center p-4">
          <div className="text-red-500 font-medium mb-2">Error loading map</div>
          <div className="text-sm text-gray-600">Please try again later</div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-2xl">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A9785] mx-auto mb-2"></div>
          <div className="text-gray-600">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={markerPosition || defaultCenter}
      zoom={markerPosition ? 15 : 12}
      options={{
        // Mobile-friendly map options
        gestureHandling: "cooperative",
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      {markerPosition && (
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={(e) => {
            if (onMarkerDragEnd) {
              onMarkerDragEnd({
                lat: e.latLng?.lat() || 0,
                lng: e.latLng?.lng() || 0,
              });
            }
          }}
        />
      )}
    </GoogleMap>
  );
}
