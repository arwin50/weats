"use client"

import { useCallback, useState, useEffect } from "react"
import Slider from "@mui/material/Slider"
import WizardStepLayout from "../wizard-step-layout"

interface FormData {
  maxPrice: number
  foodPreference: string
  dietaryPreference: string
  locationEnabled: boolean
}

interface StepOneProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  onNext: () => void
}

export default function StepOne({ formData, updateFormData, onNext }: StepOneProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMaxPriceChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (typeof newValue === "number") {
        updateFormData({ maxPrice: newValue })
      }
    },
    [updateFormData],
  )

  return (
    <WizardStepLayout title="We need to know more about you!" subtitle="What's your price range?" onNext={onNext}>
      <div className="relative mb-8">
        <div className="flex justify-between mb-4 text-sm text-gray-600">
          <span>₱0</span>
          <span>₱{formData.maxPrice}</span>
        </div>

        <div className="w-full px-2">
          {mounted && (
            <Slider
              min={0}
              max={1000}
              step={1}
              value={formData.maxPrice}
              onChange={handleMaxPriceChange}
              valueLabelDisplay="auto"
              getAriaLabel={() => "Maximum price"}
              sx={{
                color: "#E26F43",
                "& .MuiSlider-thumb": {
                  borderRadius: "50%",
                  border: "2px solid #E26F43",
                },
                "& .MuiSlider-rail": {
                  opacity: 0.15,
                  backgroundColor: "#E26F43",
                },
                "& .MuiSlider-track": {
                  borderRadius: 4,
                },
              }}
            />
          )}
        </div>
      </div>
    </WizardStepLayout>
  )
}
