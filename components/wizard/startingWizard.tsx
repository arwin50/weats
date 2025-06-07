"use client"

import { useState } from "react"
import Image from "next/image"
import logo from "@/assets/images/logo.svg"
import StepOne from "./wizard-layout/wizard-steps/step-one"
import StepTwo from "./wizard-layout/wizard-steps/step-two"
import StepThree from "./wizard-layout/wizard-steps/step-three"
import StepFour from "./wizard-layout/wizard-steps/step-four"

interface FormData {
  maxPrice: number
  foodPreference: string
  dietaryPreference: string
  locationEnabled: boolean
  locationCoords?: { lat: number; lng: number }
}

export default function StartingWizardRefactored() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    maxPrice: 75,
    foodPreference: "Surprise me, Choosee!",
    dietaryPreference: "Not choosy atm!",
    locationEnabled: false,
  })

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      console.log("Form Data:", formData)
      console.log("Max Price:", formData.maxPrice)
      console.log("Food Preference:", formData.foodPreference)
      console.log("Dietary Preference:", formData.dietaryPreference)
      console.log("Location Enabled:", formData.locationEnabled)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-[#FEF5E3] py-6 sm:py-8 px-3 sm:px-4 md:px-6 animate-gradient">
      {/* Logo */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-4 md:right-8">
        <Image
          src={logo || "/placeholder.svg"}
          alt="Logo"
          width={80}
          height={80}
          className="object-contain sm:w-[100px] sm:h-[100px] md:w-[130px] md:h-[130px]"
        />
      </div>

      {/* Step indicator */}
      <div className="flex justify-center mb-6 sm:mb-8 mt-12 sm:mt-16 md:mt-8">
        <div className="flex gap-1.5 sm:gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                step <= currentStep ? "bg-teal-500" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex justify-center items-center min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh]">
        {currentStep === 1 && <StepOne formData={formData} updateFormData={updateFormData} onNext={handleNext} />}
        {currentStep === 2 && (
          <StepTwo formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <StepThree formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 4 && (
          <StepFour formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}
