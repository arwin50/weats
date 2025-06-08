"use client"
import { useState } from "react"
import type { MapMarker } from "./map"
import Image from "next/image"
import { useSelector } from "react-redux"
import Link from "next/link"
import { authApi } from "@/lib/redux/slices/authSlice"

interface RestaurantListOverlayProps {
  restaurants: MapMarker[]
  onSelectRestaurant: (restaurant: MapMarker) => void
  isVisible: boolean
  preferences: any
}

export const RestaurantListOverlay = ({
  restaurants,
  onSelectRestaurant,
  isVisible,
  preferences,
}: RestaurantListOverlayProps) => {
  const user = useSelector((state: any) => state.auth.user)
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)
  const [showModal, setShowModal] = useState(false)
  const [showAlreadySavedModal, setShowAlreadySavedModal] = useState(false)

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      setShowModal(true)
      return
    }
    try {
      const response = await authApi.post("/suggestions/save_suggestions/", {
        lat: preferences.locationCoords?.lat || 10.3157,
        lng: preferences.locationCoords?.lng || 123.8854,
        preferences: {
          food_preference: preferences.foodPreference,
          dietary_preference: preferences.dietaryPreference,
          max_price: preferences.maxPrice,
        },
        restaurants,
      })
      alert("Suggestions saved!")
    } catch (error: any) {
      if (error.response?.data?.code === "DUPLICATE_SUGGESTION") {
        setShowAlreadySavedModal(true)
      } else {
        alert("Failed to save suggestions.")
      }
    }
  }

  return (
    <>
      <div
        className={`fixed left-0 top-20 sm:top-24 md:top-28 h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[400px] xl:w-[450px] bg-[#D5DBB5] border-4 sm:border-8 border-[#D5DBB5] transform transition-transform duration-300 ease-in-out flex flex-col items-center rounded-r-3xl ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col bg-[#D5DBB5] w-full">
          <div className="flex flex-col sm:flex-row justify-between sm:justify-evenly p-3 sm:p-4 border-b border-[#BFC59A] w-full items-start sm:items-center gap-2 sm:gap-0">
            <h1 className="text-lg sm:text-2xl font-playfair font-semibold text-gray-800">Suggestions for</h1>
            {preferences.foodPreference && (
              <div className="flex items-center justify-start sm:justify-evenly">
                <p className="text-xs sm:text-sm bg-white text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm border border-gray-100 rounded">
                  {preferences.foodPreference}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 p-3 sm:p-4 bg-[#E8EED2] w-full justify-start sm:justify-evenly">
            {preferences && (
              <>
                {preferences.dietaryPreference && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-gray-600">Diet:</span>
                    <p className="text-xs bg-white text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm border border-gray-100 rounded">
                      {preferences.dietaryPreference}
                    </p>
                  </div>
                )}
                {preferences.maxPrice && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-gray-600">Budget:</span>
                    <p className="text-xs bg-white text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm border border-gray-100 rounded">
                      {preferences.maxPrice}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="w-full flex-1 overflow-y-auto p-3 sm:p-4 z-40 rounded-r-xl custom-scrollbar">
          {restaurants.map((restaurant, index) => (
            <button
              key={index}
              className="bg-[#FEF5E3] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-md flex items-start gap-3 sm:gap-4 w-full cursor-pointer hover:scale-105 transition duration-300"
              onClick={() => onSelectRestaurant(restaurant)}
            >
              <div className="relative w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 flex-shrink-0">
                {restaurant.photo_url ? (
                  <Image
                    src={restaurant.photo_url || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="text-black text-sm sm:text-md font-playfair font-semibold leading-snug truncate">
                    {restaurant.name}
                  </h3>
                  <span className="bg-[#8AF085] text-green-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    Open
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-600 mt-1 flex flex-col gap-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span>{restaurant.rating || "None"}</span>
                  </div>
                </div>

                <div className="mt-2 sm:mt-4 flex justify-between items-center gap-2">
                  {restaurant.types?.[0] && (
                    <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full truncate max-w-full">
                      {restaurant.types[0].replace(/_/g, " ")}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 sm:p-4 w-full">
          <button
            onClick={handleSaveClick}
            className="bg-teal-500 hover:bg-teal-600 text-white text-center py-2 sm:py-3 w-full cursor-pointer rounded-lg text-sm sm:text-base transition-colors"
          >
            Save Suggestions
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-sm text-center">
            <h2 className="text-lg sm:text-xl font-playfair font-semibold mb-3 sm:mb-4">
              Save your Choosee prompts now!
            </h2>
            <div className="flex flex-col gap-3 sm:gap-4 justify-center">
              <Link href="/login">
                <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 sm:p-4 rounded-md w-full cursor-pointer text-sm sm:text-base transition-colors">
                  Log In
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-3 sm:p-4 rounded-md w-full cursor-pointer text-sm sm:text-base transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-3 sm:mt-4 text-sm text-gray-500 hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAlreadySavedModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-sm text-center">
            <h2 className="text-lg sm:text-xl font-playfair font-semibold mb-3 sm:mb-4">
              This suggestion is already saved!
            </h2>
            <div className="flex flex-col gap-3 sm:gap-4 justify-center">
              <button
                className="bg-[#FF9268] hover:bg-[#E57E56] text-green-900 p-3 sm:p-4 rounded-md w-full cursor-pointer text-sm sm:text-base transition-colors"
                onClick={() => setShowAlreadySavedModal(false)}
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
