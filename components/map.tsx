"use client"

import React, { useState, useCallback, useEffect } from "react"
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api"
import { RestaurantModal } from "./RestaurantModal"

const getContainerStyle = () => ({
  width: "100%",
  height: "100vh", // Full viewport height for better mobile experience
})

const getMarkerSymbol = (color: string, scale = 10) => {
  // Check if Google Maps is fully loaded
  if (typeof window.google === "undefined" || !window.google.maps || !window.google.maps.SymbolPath) {
    console.warn("Google Maps API not fully loaded")
    return {
      path: "CIRCLE", // Fallback to string path
      fillColor: color,
      fillOpacity: 0.9,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale,
    }
  }

  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale,
  }
}

export interface MapMarker {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating?: number
  user_ratings_total?: number
  price_level?: number | null
  types?: string[]
  description?: string
  recommendation_reason?: string
  rank?: number
  photo_url?: string
  isVisited?: boolean
}

interface MapProps {
  markers: MapMarker[]
  center: { lat: number; lng: number }
}

export const FoodMap = ({ markers, center }: MapProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<MapMarker | null>(null)
  const [mapCenter, setMapCenter] = useState(center)
  const [travelInfo, setTravelInfo] = useState<{
    distanceText: string
    durationText: string
  } | null>(null)
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([])
  const mapRef = React.useRef<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { isLoaded: googleMapsIsLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Check if Google Maps is fully loaded
    if (window.google && window.google.maps && window.google.maps.SymbolPath) {
      setIsGoogleMapsReady(true)
      setIsLoaded(true)
    } else {
      // If not loaded, set up a listener for when it loads
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.SymbolPath) {
          setIsGoogleMapsReady(true)
          setIsLoaded(true)
          clearInterval(checkGoogleMaps)
        }
      }, 100)

      // Cleanup interval
      return () => clearInterval(checkGoogleMaps)
    }
  }, [])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedRestaurant(marker)
    const destination = { lat: marker.lat, lng: marker.lng }

    if (mapRef.current) {
      mapRef.current.panTo(destination)
    }
  }

  const getMarkerStyle = (marker: MapMarker) => {
    let color = "#E26F43" // default
    if (marker.isVisited)
      color = "#4CAF50" // Green for visited
    else if (marker.rating && marker.rating >= 4.5) color = "#4CAF50"
    else if (marker.price_level && marker.price_level >= 3) color = "#9C27B0"

    // Adjust marker size based on device type and rank
    const baseScale = isMobile ? 8 : 10 // Smaller markers on mobile
    const scale = marker.rank ? Math.max(baseScale, (isMobile ? 12 : 14) - marker.rank * 0.5) : baseScale
    return getMarkerSymbol(color, scale)
  }

  const getMapOptions = () => ({
    fullscreenControl: !isMobile, // Hide fullscreen control on mobile
    mapTypeControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: isMobile
        ? window.google.maps?.ControlPosition?.TOP_RIGHT
        : window.google.maps?.ControlPosition?.RIGHT_CENTER,
    },
    streetViewControl: !isMobile, // Hide street view control on mobile
    gestureHandling: isMobile ? "greedy" : "cooperative", // Better touch handling on mobile
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
  })

  const getInitialZoom = () => {
    return isMobile ? 14 : 15 // Slightly zoomed out on mobile for better overview
  }

  if (!isLoaded || !isGoogleMapsReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#5A9785]"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <div className="text-red-500 text-2xl sm:text-4xl mb-4">⚠️</div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Error loading maps</h2>
          <p className="text-sm sm:text-base text-gray-600">Please check your internet connection and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <GoogleMap
        mapContainerStyle={getContainerStyle()}
        center={mapCenter}
        zoom={getInitialZoom()}
        onLoad={onMapLoad}
        options={getMapOptions()}
      >
        {/* User location marker */}
        <Marker
          position={mapCenter}
          icon={getMarkerSymbol("#4285F4", isMobile ? 8 : 10)}
          zIndex={1000}
          title="Your location"
        />

        {/* Restaurant markers */}
        {markers.map((marker, index) => {
          // Debug log for marker data
          console.log("Rendering marker:", {
            name: marker.name,
            rank: marker.rank,
            rankType: typeof marker.rank,
            isVisited: marker.isVisited,
          })

          return (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.name}
              onClick={() => handleMarkerClick(marker)}
              icon={getMarkerStyle(marker)}
              label={{
                text: marker.isVisited ? "V" : marker.rank?.toString() || "",
                color: "#ffffff",
                fontSize: isMobile ? "12px" : "14px", // Smaller font on mobile
                fontWeight: "bold",
              }}
            />
          )
        })}

        {/* Route polyline */}
        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: "#4285F4",
              strokeWeight: isMobile ? 4 : 5, // Thinner line on mobile
              strokeOpacity: 0.8,
            }}
          />
        )}
      </GoogleMap>

      {/* Restaurant Modal */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={!!selectedRestaurant}
        onClose={() => {
          setSelectedRestaurant(null)
          setRoutePath([])
          setTravelInfo(null)
        }}
        travelInfo={travelInfo}
      />
    </div>
  )
}
