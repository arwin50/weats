"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import WizardStepLayout from "../wizard-step-layout";

interface FormData {
  maxPrice: number;
  foodPreference: string;
  dietaryPreference: string;
  locationEnabled: boolean;
}

interface StepTwoProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTwo({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepTwoProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customFood, setCustomFood] = useState("");
  const [showModal, setShowModal] = useState(false);

  const foodOptions = [
    "Surprise me, Choosee!",
    "I'm picky I want...",
    "Mediterranean",
    "Greek",
    "Turkish",
    "Middle Eastern",
    "French",
    "Spanish",
    "Italian",
    "Chinese",
    "Japanese",
    "Korean",
    "Thai",
    "Vietnamese",
    "Indian",
    "Filipino",
    "American",
    "Mexican",
    "Brazilian",
    "Caribbean",
    "German",
    "BBQ",
    "Fast Food",
    "Seafood",
    "Desserts",
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const selectOption = (option: string) => {
    updateFormData({ foodPreference: option });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (
      formData.foodPreference !== "I'm picky I want..." &&
      !foodOptions.includes(formData.foodPreference)
    ) {
      setCustomFood(formData.foodPreference);
    }
  }, [formData.foodPreference]);

  const handleNext = () => {
    const isCustomSelected = formData.foodPreference === "I'm picky I want...";
    const isCustomTyped = !foodOptions.includes(formData.foodPreference);

    if ((isCustomSelected || isCustomTyped) && customFood.trim() === "") {
      setShowModal(true);
      return;
    }

    if ((isCustomSelected || isCustomTyped) && customFood.trim() !== "") {
      updateFormData({ foodPreference: customFood.trim() });
    }

    onNext();
  };

  return (
    <>
      <WizardStepLayout
        title="Great! We now know your budget. Next is..."
        subtitle="What kind of food are you in the mood for?"
        onBack={onBack}
        onNext={handleNext}
        showBackButton={true}
      >
        <div className="flex justify-center relative">
          <div className="relative w-full max-w-xs">
            <button
              onClick={toggleDropdown}
              className={`${
                formData.foodPreference === "I'm picky I want..." ||
                !foodOptions.includes(formData.foodPreference)
                  ? "bg-[#5A9785] hover:bg-[#6BA885]"
                  : "bg-[#E26F43] hover:bg-[#F36F43]"
              } font-playfair cursor-pointer text-white px-6 py-3 text-lg font-medium w-full text-center relative shadow-md/20 flex items-center justify-between gap-2 ${
                isDropdownOpen ? "rounded-t-lg" : "rounded-lg"
              }`}
            >
              <span>
                {formData.foodPreference === "I'm picky I want..." ||
                !foodOptions.includes(formData.foodPreference)
                  ? "I'm picky I want..."
                  : formData.foodPreference}
              </span>
              <ChevronDown className="w-5 h-5 text-white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute w-full z-10">
                <div className="bg-[#AA4D2A] rounded-b-lg shadow-md/20 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {foodOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => selectOption(option)}
                        className={`font-playfair block w-full text-left px-6 py-3 text-white text-lg font-medium transition-colors${
                          option === formData.foodPreference
                            ? "bg-[#AA4D2A]"
                            : "hover:bg-[#8B3F22] cursor-pointer"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {(formData.foodPreference === "I'm picky I want..." ||
          !foodOptions.includes(formData.foodPreference)) && (
          <div className="mt-6 max-w-xs mx-auto">
            <input
              id="customFoodInput"
              type="text"
              placeholder="e.g., Sushi, Lasagna, Biryani..."
              className="w-full bg-white text-gray-700 placeholder-gray-400 px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-orange-400 border-0"
              value={customFood}
              onChange={(e) => setCustomFood(e.target.value)}
            />
          </div>
        )}
      </WizardStepLayout>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Please put in your food preferences!
            </h2>
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
  );
}
