"use client"

import { MapPin } from "lucide-react"
import WizardStepLayout from "../wizard-step-layout"

interface FormData {
  maxPrice: number
  foodPreference: string
  dietaryPreference: string
  locationEnabled: boolean
}

interface StepFourProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepFour({ formData, updateFormData, onNext, onBack }: StepFourProps) {
  const handleLocationToggle = () => {
    updateFormData({ locationEnabled: !formData.locationEnabled })
  }

  return (
    <WizardStepLayout
      title="Almost here! We just need one last thing from you..."
      subtitle="We need to know your exact location for us to know your nearest food places!"
      onBack={onBack}
      onNext={onNext}
      showBackButton={true}
    >
      <div className="flex justify-center">
        <button
          onClick={handleLocationToggle}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20 ${formData.locationEnabled
              ? "bg-green-600 hover:bg-green-700 text-white shadow-md/20"
              : "bg-[#5A9785] hover:bg-teal-600 text-white shadow-md/20"
            }`}
        >
          <MapPin className="w-5 h-5" />
          {formData.locationEnabled ? "Location Enabled" : "Enable location"}
        </button>
      </div>
    </WizardStepLayout>
  )
}
