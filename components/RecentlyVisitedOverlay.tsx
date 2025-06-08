"use client"
import type { MapMarker } from "./map"
import Image from "next/image"

interface RecentlyVisitedOverlayProps {
  recentlyVisited: MapMarker[]
  onSelectRestaurant: (restaurant: MapMarker) => void
  isVisible: boolean
  isLoading?: boolean
  error?: string | null
}

export const RecentlyVisitedOverlay = ({
  recentlyVisited,
  onSelectRestaurant,
  isVisible,
  isLoading = false,
  error = null,
}: RecentlyVisitedOverlayProps) => {
  if (isLoading) {
    return (
      <div
        className={`fixed left-0 top-20 sm:top-24 md:top-28 h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[400px] xl:w-[450px] bg-[#FFF396] p-3 sm:p-4 z-40 shadow-md rounded-r-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-[#5A9785]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`fixed left-0 top-20 sm:top-24 md:top-28 h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[400px] xl:w-[450px] bg-[#B1A0C9] p-3 sm:p-4 z-40 shadow-md rounded-r-3xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="text-red-500 text-center text-sm sm:text-base">{error}</div>
      </div>
    )
  }

  return (
    <div
      className={`fixed left-0 top-20 sm:top-24 md:top-28 h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[400px] xl:w-[450px] bg-[#B1A0C9] overflow-y-auto p-3 sm:p-4 z-40 shadow-md rounded-r-xl custom-scrollbar transform transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <h1 className="text-xl sm:text-2xl font-playfair font-semibold text-gray-800 mb-3 sm:mb-4">Recently Visited</h1>
      <p className="mb-3 text-sm sm:text-base text-gray-800">This is where restaurants you mark as visited will be displayed.</p>
      {recentlyVisited.map((restaurant, index) => (
        <div
          key={index}
          className="bg-[#FEF5E3] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-md flex items-start gap-3 sm:gap-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelectRestaurant(restaurant)}
        >
          <div className="relative w-12 h-16 sm:w-16 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
            {restaurant.photo_url ? (
              <Image
                src={restaurant.photo_url || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-xs">No image</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="text-black text-sm sm:text-md font-playfair font-semibold leading-snug truncate">
                {restaurant.name}
              </h3>
              <span className="bg-[#8AF085] text-green-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">Open</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1 flex flex-col gap-1">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★</span>
                <span>{restaurant.rating || "None"}</span>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              {restaurant.types?.[0] && (
                <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full truncate max-w-full">
                  {restaurant.types[0].replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
