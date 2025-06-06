"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import WizardStepLayout from "../wizard-step-layout"

interface FormData {
  maxPrice: number
  foodPreference: string
  dietaryPreference: string
  locationEnabled: boolean
}

interface StepThreeProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepThree({ formData, updateFormData, onNext, onBack }: StepThreeProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [customDiet, setCustomDiet] = useState("")
  const [showModal, setShowModal] = useState(false)

  const dietaryPreferences = [
    { name: "Not choosy atm!", description: "" },
    { name: "I have!", description: "" },
    { name: "Vegetarian", description: "Excludes meat, but may include dairy and eggs." },
    { name: "Vegan", description: "Excludes all animal products including dairy and eggs." },
    { name: "Pescatarian", description: "Includes fish and seafood, but avoids other meats." },
    { name: "Flexitarian", description: "Primarily plant-based, but occasionally includes meat." },
    { name: "Gluten-Free", description: "Avoids gluten found in wheat, barley, and rye." },
    { name: "Keto", description: "High-fat, low-carb diet promoting fat burning." },
    { name: "Paleo", description: "Focuses on whole foods; excludes grains, dairy, and processed foods." },
    { name: "Halal", description: "Follows Islamic dietary laws; excludes pork and alcohol." },
    { name: "Kosher", description: "Follows Jewish dietary laws including meat and dairy separation." },
    { name: "Low FODMAP", description: "Limits certain carbs to reduce digestive symptoms like bloating." },
  ]

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

  const selectOption = (option: string) => {
    updateFormData({ dietaryPreference: option })
    if (option === "I have!") {
      setCustomDiet("")
    }
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    const isPredefinedDiet = dietaryPreferences.some((p) => p.name === formData.dietaryPreference)
    if (formData.dietaryPreference !== "I have!" && !isPredefinedDiet) {
      setCustomDiet(formData.dietaryPreference)
    }
  }, [formData.dietaryPreference])

  const handleNext = () => {
    if (formData.dietaryPreference === "I have!" && customDiet.trim() === "") {
      setShowModal(true)
      return
    }

    const isPredefinedDiet = dietaryPreferences.some((p) => p.name === formData.dietaryPreference)
    if ((formData.dietaryPreference === "I have!" || !isPredefinedDiet) && customDiet.trim() !== "") {
      updateFormData({ dietaryPreference: customDiet.trim() })
    }

    onNext()
  }

  return (
    <>
      <WizardStepLayout
        title="Okay, that is noted! Now..."
        subtitle="Any dietary preferences?"
        onBack={onBack}
        onNext={handleNext}
        showBackButton={true}
      >
        <div className="flex justify-center relative">
          <div className="relative w-full max-w-xs">
            <button
              onClick={toggleDropdown}
              className={`${
                formData.dietaryPreference === "I have!" ||
                !dietaryPreferences.some((p) => p.name === formData.dietaryPreference)
                  ? "bg-[#5A9785] hover:bg-[#6BA885]"
                  : "bg-[#E26F43] hover:bg-[#F36F43]"
              } font-playfair cursor-pointer text-white px-6 py-3 text-lg font-medium w-full text-center relative shadow-md/20 flex items-center justify-between gap-2 ${
                isDropdownOpen ? "rounded-t-lg" : "rounded-lg"
              }`}
            >
              <span>
                {formData.dietaryPreference === "I have!" ||
                !dietaryPreferences.some((p) => p.name === formData.dietaryPreference)
                  ? "I have!"
                  : formData.dietaryPreference}
              </span>
              <ChevronDown className="w-5 h-5 text-white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute w-full z-10">
                <div className="bg-[#AA4D2A] rounded-b-lg shadow-md/20 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {dietaryPreferences.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => selectOption(option.name)}
                        className={`block w-full text-left px-6 py-3 text-white text-lg font-medium transition-colors ${
                          option.name === formData.dietaryPreference
                            ? "bg-[#AA4D2A]"
                            : "hover:bg-[#8B3F22] cursor-pointer"
                        }`}
                      >
                        <div>
                          <div className=" font-playfair">{option.name}</div>
                          <div className="text-sm opacity-80">{option.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {(formData.dietaryPreference === "I have!" ||
          !dietaryPreferences.some((p) => p.name === formData.dietaryPreference)) && (
          <div className="mt-6 max-w-xs mx-auto">
            <input
              id="customDietInput"
              type="text"
              placeholder="e.g., Lactose-free, Nut allergy..."
              className="w-full bg-white text-gray-700 placeholder-gray-400 px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-orange-400 border-0"
              value={customDiet}
              onChange={(e) => setCustomDiet(e.target.value)}
            />
          </div>
        )}
      </WizardStepLayout>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Please put in your dietary preferences!</h2>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  )
}
