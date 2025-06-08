"use client"

import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/images/logo.svg"
import { UserMenu } from "@/components/userMenu"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StartingPage() {
  const router = useRouter()

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="animate-gradient h-screen flex flex-col justify-center items-center bg-[#fdf1dc] text-center px-3 xs:px-4 overflow-hidden">
      <UserMenu />
      <button
        onClick={handleBackToDashboard}
        className="fixed top-4 xs:top-6 sm:top-7 left-14 xs:left-18 sm:left-22 z-50 flex items-center gap-1 sm:gap-2 bg-[#5A9785] hover:bg-[#477769] text-white py-1.5 xs:py-2 sm:py-3 px-2 xs:px-3 sm:px-6 rounded-lg shadow-lg transition-colors text-xs xs:text-sm sm:text-base cursor-pointer"
      >
        <ArrowLeft className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
        <span className="hidden xs:inline">Back to Dashboard</span>
        <span className="inline xs:hidden">Back</span>
      </button>

      <p className="text-xl xs:text-2xl sm:text-4xl text-green-700">Hungry?</p>

      <h1 className="text-2xl xs:text-3xl sm:text-6xl md:text-8xl lg:text-10xl text-[#cc4d4d] -mt-2 xs:-mt-4 sm:-mt-8 md:-mt-16 lg:-mt-24">
        Where do
      </h1>
      <h1 className="text-2xl xs:text-3xl sm:text-6xl md:text-8xl lg:text-10xl text-orange-500 font-extrabold -mt-2 xs:-mt-4 sm:-mt-8 md:-mt-16 lg:-mt-24">
        YOU
      </h1>
      <h1 className="text-xl xs:text-2xl sm:text-5xl md:text-7xl lg:text-8xl text-[#cc4d4d] -mt-2 xs:-mt-4 sm:-mt-6 md:-mt-8 lg:-mt-10">
        wanna eat?
      </h1>

      <Link
        href="/startingWizard"
        className="font-playfair mt-4 xs:mt-6 sm:mt-8 md:mt-10 px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 bg-[#d3d8a3] text-xs xs:text-sm sm:text-base md:text-lg text-green-900 rounded-lg shadow-md hover:shadow-lg hover:bg-[#c3d891] transition"
      >
        Let Choosee choose it!
      </Link>

      <div className="absolute top-2 xs:top-3 right-2 xs:right-3 sm:top-4 sm:right-4 md:top-4 md:right-8">
        <Image
          src={logo || "/placeholder.svg"}
          alt="Logo"
          width={60}
          height={60}
          className="object-contain w-[60px] h-[60px] xs:w-[70px] xs:h-[70px] sm:w-[100px] sm:h-[100px] md:w-[130px] md:h-[130px]"
        />
      </div>
    </div>
  )
}
