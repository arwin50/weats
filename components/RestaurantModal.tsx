"use client"

import { useState, useEffect } from "react"
import type { MapMarker } from "./map"
import PlaceIcon from "@mui/icons-material/Place"
import CloseIcon from "@mui/icons-material/Close"
import Image from "next/image"
import { authApi } from "@/lib/redux/slices/authSlice"
import { useAppSelector } from "@/lib/redux/hooks"

interface RestaurantModalProps {
  restaurant: MapMarker | null
  isOpen: boolean
  onClose: () => void
  travelInfo?: {
    distanceText: string
    durationText: string
  } | null
  onVisitedUpdate?: () => void
}

export const RestaurantModal = ({ restaurant, isOpen, onClose, travelInfo, onVisitedUpdate }: RestaurantModalProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [isVisited, setIsVisited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkVisitedStatus = async () => {
      if (!restaurant || !isAuthenticated) return
      try {
        const response = await authApi.post("/visited/check_visited/", {
          location: {
            name: restaurant.name,
            address: restaurant.address,
          },
        })
        setIsVisited(response.data.is_visited)
      } catch (err) {
        console.error("Error checking visited status:", err)
      }
    }

    if (isOpen && restaurant) {
      checkVisitedStatus()
    }
  }, [isOpen, restaurant, isAuthenticated])

  const handleToggleVisited = async () => {
    if (!restaurant) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await authApi.post("/visited/toggle_visited/", {
        location: {
          name: restaurant.name,
          address: restaurant.address,
          lat: restaurant.lat,
          lng: restaurant.lng,
          rating: restaurant.rating,
          user_ratings_total: restaurant.user_ratings_total,
          price_level: restaurant.price_level,
          types: restaurant.types,
          description: restaurant.description,
          recommendation_reason: restaurant.recommendation_reason,
          photo_url: restaurant.photo_url,
        },
        notes: `Visited ${restaurant.name}`,
      })

      setIsVisited(response.data.is_visited)

      // Call the update function to refresh visited locations
      if (onVisitedUpdate) {
        await onVisitedUpdate()
      }
    } catch (err) {
      console.error("Error toggling visited status:", err)
      setError("Failed to update visited status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !restaurant) return null

  return (
    <div
      className={`fixed 
    // Mobile: bottom sheet
    bottom-0 left-0 right-0 max-h-[70vh] w-full
    // Desktop: small popup (top-right)
    sm:top-4 sm:right-4 sm:bottom-auto sm:left-auto sm:max-h-[85vh] sm:w-[380px] md:w-[400px] lg:w-[420px]
    bg-[#FEF5E3] border-2 sm:border-4 md:border-6 lg:border-8 border-[#D5DBB5] shadow-lg 
    // Mobile: rounded top corners only
    rounded-t-xl 
    // Desktop: rounded all corners
    sm:rounded-xl 
    z-100 overflow-y-auto text-black custom-scrollbar`}
    >
      {/* Image area */}
      <div className="relative h-24 xs:h-32 sm:h-40 md:h-48 w-full">
        {restaurant.photo_url ? (
          <Image
            src={restaurant.photo_url || "/placeholder.svg"}
            alt={restaurant.name}
            fill
            className="object-cover rounded-t-base sm:rounded-t-lg"
          />
        ) : (
          <div className="h-full w-full bg-gray-300 rounded-t-base sm:rounded-t-lg flex items-center justify-center">
            <span className="text-gray-500 text-xs xs:text-sm sm:text-base">No image available</span>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 xs:top-2.5 xs:right-2.5 sm:top-3 sm:right-3 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Content area */}
      <div className="p-2 xs:p-3 sm:p-4">
        {/* Restaurant name and status */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <h2 className="text-sm xs:text-base sm:text-xl text-black font-playfair font-bold leading-tight flex-1">
            {restaurant.name}
          </h2>
          <span className="bg-[#8AF085] text-green-700 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-full text-xs font-medium whitespace-nowrap">
            Open
          </span>
        </div>

        {/* Rating */}
        {restaurant.rating && (
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 mb-1.5 xs:mb-2">
            <span className="text-yellow-500 text-base xs:text-lg">★</span>
            <span className="font-semibold text-sm xs:text-base">{restaurant.rating}</span>
            {restaurant.user_ratings_total && (
              <span className="text-gray-600 text-xs xs:text-sm">({restaurant.user_ratings_total})</span>
            )}
          </div>
        )}

        {/* Distance and time info */}
        {travelInfo && (
          <div className="text-xs xs:text-sm text-gray-600 mt-2">
            <p>🚗 Distance: {travelInfo.distanceText}</p>
            <p>⏱ Duration: {travelInfo.durationText}</p>
          </div>
        )}

        {/* Restaurant Address */}
        <div className="flex items-start gap-1 xs:gap-1.5 sm:gap-2 mb-1.5 xs:mb-2">
          <PlaceIcon className="text-sm mt-0.5 flex-shrink-0" fontSize="small" />
          <p className="text-gray-700 text-xs xs:text-sm">{restaurant.address}</p>
        </div>

        {/* Cuisine types */}
        {restaurant.types && (
          <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mb-2 xs:mb-3">
            {restaurant.types.map((type, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-1.5 xs:px-2 py-0.5 rounded-full text-xs xs:text-sm"
              >
                {type.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}

        {/* About and Recommendations */}
        <div className="space-y-2 xs:space-y-3 sm:space-y-4">
          {restaurant.description && (
            <div className="border-t border-gray-200 pt-2 xs:pt-3 sm:pt-4">
              <h3 className="font-semibold mb-1.5 xs:mb-2 text-sm xs:text-base">About</h3>
              <p className="text-gray-700 text-xs xs:text-sm">{restaurant.description}</p>
            </div>
          )}

          {restaurant.recommendation_reason && (
            <div className="bg-blue-50 p-2 xs:p-2.5 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-1.5 xs:mb-2 text-sm xs:text-base">Why We Recommend</h3>
              <p className="text-blue-800 text-xs xs:text-sm">{restaurant.recommendation_reason}</p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <div className="text-red-500 text-xs xs:text-sm mb-3 xs:mb-4 text-center">{error}</div>}

        {/* Mark as visited button */}
        {isAuthenticated ? (
          <button
            onClick={handleToggleVisited}
            disabled={isLoading}
            className={`w-full mt-2 xs:mt-3 sm:mt-4 ${
              isVisited ? "bg-gray-400 hover:bg-gray-500" : "bg-[#5A9785] hover:bg-[#48796B]"
            } text-white py-1.5 xs:py-2 sm:py-3 px-2 xs:px-3 sm:px-4 rounded-full text-xs xs:text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-white mr-1.5 xs:mr-2"></div>
                Updating...
              </span>
            ) : isVisited ? (
              "Remove from Visited"
            ) : (
              "Mark as Visited"
            )}
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
