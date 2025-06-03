"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";

interface FormData {
  priceRange: [number, number];
  foodPreference: string;
  locationEnabled: boolean;
}

export default function StartingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    priceRange: [25, 75],
    foodPreference: "Surprise me, Choosee!",
    locationEnabled: false,
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - log all data
      console.log("Form Data:", formData);
      console.log("Price Range:", formData.priceRange);
      console.log("Food Preference:", formData.foodPreference);
      console.log("Location Enabled:", formData.locationEnabled);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...formData.priceRange] as [number, number];
    newRange[index] = value;
    setFormData({ ...formData, priceRange: newRange });
  };

  const handleFoodPreferenceChange = (value: string) => {
    setFormData({ ...formData, foodPreference: value });
  };

  const handleLocationToggle = () => {
    setFormData({ ...formData, locationEnabled: !formData.locationEnabled });
  };

  const StepOne = () => (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-medium text-teal-600 text-center mb-8 px-4">
        We need to know more about you!
      </h1>

      <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-4 md:mx-0">
        <h2 className="text-xl md:text-2xl font-medium text-gray-700 text-center mb-12">
          {"What's your price range?"}
        </h2>

        <div className="relative mb-8">
          <div className="flex justify-between mb-4 text-sm text-gray-600">
            <span>${formData.priceRange[0]}</span>
            <span>${formData.priceRange[1]}</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={formData.priceRange[0]}
              onChange={(e) =>
                handlePriceRangeChange(0, Number.parseInt(e.target.value))
              }
              className="absolute w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={formData.priceRange[1]}
              onChange={(e) =>
                handlePriceRangeChange(1, Number.parseInt(e.target.value))
              }
              className="absolute w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleNext}
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer"
        >
          Next, please!
        </button>
      </div>
    </div>
  );

  const StepTwo = () => (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-medium text-teal-600 text-center mb-8 px-4">
        Great! We now know your budget. Next is...
      </h1>

      <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-4 md:mx-0">
        <h2 className="text-xl md:text-2xl font-medium text-gray-700 text-center mb-12">
          What kind of food are you in the mood for?
        </h2>

        <div className="flex justify-center">
          <div className="relative">
            <select
              value={formData.foodPreference}
              onChange={(e) => handleFoodPreferenceChange(e.target.value)}
              className="bg-red-400 text-white px-6 py-3 rounded-full text-lg font-medium appearance-none cursor-pointer pr-12 min-w-[250px] text-center"
            >
              <option value="Surprise me, Choosee!">
                Surprise me, Choosee!
              </option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Mexican">Mexican</option>
              <option value="Indian">Indian</option>
              <option value="American">American</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8 px-4">
        <button
          onClick={handleBack}
          className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer"
        >
          Go back
        </button>
        <button
          onClick={handleNext}
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer"
        >
          Next, please!
        </button>
      </div>
    </div>
  );

  const StepThree = () => (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-medium text-teal-600 text-center mb-8 px-4">
        Almost there! We just need one last thing from you...
      </h1>

      <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-4 md:mx-0">
        <h2 className="text-xl md:text-2xl font-medium text-gray-700 text-center mb-12 leading-relaxed">
          We need to know your exact location for us to know your nearest food
          places!
        </h2>

        <div className="flex justify-center">
          <button
            onClick={handleLocationToggle}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer ${
              formData.locationEnabled
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-[#5A9785] hover:bg-teal-600 text-white"
            }`}
          >
            <MapPin className="w-5 h-5" />
            {formData.locationEnabled ? "Location Enabled" : "Enable location"}
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8 px-4">
        <button
          onClick={handleBack}
          className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer"
        >
          Go back
        </button>
        <button
          onClick={handleNext}
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer"
        >
          Next, please!
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FEF5E3] py-8 px-4">
      {/* Logo placeholder */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-teal-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm md:text-base">
            Logo
          </span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center mb-8 mt-16 md:mt-8">
        <div className="flex gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                step <= currentStep ? "bg-teal-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex justify-center items-center min-h-[60vh]">
        {currentStep === 1 && <StepOne />}
        {currentStep === 2 && <StepTwo />}
        {currentStep === 3 && <StepThree />}
      </div>
    </div>
  );
}
