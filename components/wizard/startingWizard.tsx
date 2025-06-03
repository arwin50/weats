"use client";

import { useCallback, useState, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import Slider from "@mui/material/Slider";

interface FormData {
  maxPrice: number;
  foodPreference: string;
  dietaryPreference: string;
  locationEnabled: boolean;
}

interface StepTwoProps {
  formData: { foodPreference: string };
  handleFoodPreferenceChange: (option: string) => void;
  handleBack: () => void;
  handleNext: () => void;
}

export default function StartingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    maxPrice: 75,
    foodPreference: "Surprise me, Choosee!",
    dietaryPreference: "Not choosy atm!",
    locationEnabled: false,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Form Data:", formData);
      console.log("Max Price:", formData.maxPrice);
      console.log("Food Preference:", formData.foodPreference);
      console.log("Dietary Preference:", formData.dietaryPreference);
      console.log("Location Enabled:", formData.locationEnabled);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMaxPriceChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (typeof newValue === "number") {
        setFormData((prev) => {
          if (prev.maxPrice === newValue) return prev;
          return { ...prev, maxPrice: newValue };
        });
      }
    },
    []
  );

  const handleFoodPreferenceChange = (value: string) => {
    setFormData({ ...formData, foodPreference: value });
  };

  const handleDietaryPreferenceChange = (value: string) => {
    setFormData({ ...formData, dietaryPreference: value });
  };

  const handleLocationToggle = () => {
    setFormData({ ...formData, locationEnabled: !formData.locationEnabled });
  };

  const StepOne = () => (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-medium text-teal-600 text-center mb-8 px-4">
        We need to know more about you!
      </h1>

      <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-4 md:mx-0 shadow-md/20">
        <h2 className="text-xl md:text-2xl font-medium text-gray-700 text-center mb-12">
          {"What's your price range?"}
        </h2>

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
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleNext}
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
        >
          Next, please!
        </button>
      </div>
    </div>
  );

  const StepTwo = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const foodOptions = [
      // General / Default
      "Surprise me, Choosee!",
      "I'm picky I want...",

      // Continental & Mediterranean
      "Mediterranean",
      "Greek",
      "Turkish",
      "Middle Eastern",
      "French",
      "Spanish",
      "Italian",

      // Asian
      "Chinese",
      "Japanese",
      "Korean",
      "Thai",
      "Vietnamese",
      "Indian",
      "Filipino",

      // American & Regional
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
      handleFoodPreferenceChange(option);
      setIsDropdownOpen(false);
    };

    return (
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-medium text-teal-600 text-center mb-8 px-4 ">
          Great! We now know your budget. Next is...
        </h1>

        <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-4 md:mx-0 shadow-md/20">
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 text-center mb-12">
            What kind of food are you in the mood for?
          </h2>

          <div className="flex justify-center relative">
            <div className="relative w-full max-w-xs">
              <button
                onClick={toggleDropdown}
                className={`${
                  formData.foodPreference === "I'm picky I want..."
                    ? "bg-[#5A9785] hover:bg-[#6BA885]"
                    : "bg-[#E26F43] hover:bg-[#F36F43]"
                } font-playfair cursor-pointer text-white px-6 py-3 text-lg font-medium w-full text-center relative shadow-md/20 flex items-center justify-between gap-2 ${
                  isDropdownOpen ? "rounded-t-lg" : "rounded-lg"
                }`}
              >
                <span>{formData.foodPreference}</span>
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
        </div>

        <div className="flex justify-center gap-4 mt-8 px-4">
          <button
            onClick={handleBack}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
          >
            Go back
          </button>
          <button
            onClick={handleNext}
            className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
          >
            Next, please!
          </button>
        </div>
      </div>
    );
  };

  const StepThree = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dietaryPreferences = [
      {
        name: "Not choosy atm!",
        description: "",
      },
      {
        name: "I have!",
        description: "",
      },
      {
        name: "Vegetarian",
        description: "Excludes meat, but may include dairy and eggs.",
      },
      {
        name: "Vegan",
        description: "Excludes all animal products including dairy and eggs.",
      },
      {
        name: "Pescatarian",
        description: "Includes fish and seafood, but avoids other meats.",
      },
      {
        name: "Flexitarian",
        description: "Primarily plant-based, but occasionally includes meat.",
      },
      {
        name: "Gluten-Free",
        description: "Avoids gluten found in wheat, barley, and rye.",
      },
      {
        name: "Keto",
        description: "High-fat, low-carb diet promoting fat burning.",
      },
      {
        name: "Paleo",
        description:
          "Focuses on whole foods; excludes grains, dairy, and processed foods.",
      },
      {
        name: "Halal",
        description: "Follows Islamic dietary laws; excludes pork and alcohol.",
      },
      {
        name: "Kosher",
        description:
          "Follows Jewish dietary laws including meat and dairy separation.",
      },
      {
        name: "Low FODMAP",
        description:
          "Limits certain carbs to reduce digestive symptoms like bloating.",
      },
    ];

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    const selectOption = (option: string) => {
      handleDietaryPreferenceChange(option);
      setIsDropdownOpen(false);
    };

    return (
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-medium text-teal-600 text-center mb-8 px-4">
          Okay, that is noted! Now...
        </h1>

        <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-4 md:mx-0 shadow-md/20">
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 text-center mb-12">
            Any dietary preferences?
          </h2>

          <div className="flex justify-center relative">
            <div className="relative w-full max-w-xs">
              <button
                onClick={toggleDropdown}
                className={`${
                  formData.dietaryPreference === "I have!"
                    ? "bg-[#5A9785] hover:bg-[#6BA885]"
                    : "bg-[#E26F43] hover:bg-[#F36F43]"
                } font-playfair cursor-pointer text-white px-6 py-3 text-lg font-medium w-full text-center relative shadow-md/20 flex items-center justify-between gap-2 ${
                  isDropdownOpen ? "rounded-t-lg" : "rounded-lg"
                }`}
              >
                <span>{formData.dietaryPreference}</span>
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
                            <div className="font-semibold font-playfair">
                              {option.name}
                            </div>
                            <div className="text-sm opacity-80">
                              {option.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 px-4">
          <button
            onClick={handleBack}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
          >
            Go back
          </button>
          <button
            onClick={handleNext}
            className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
          >
            Next, please!
          </button>
        </div>
      </div>
    );
  };

  const StepFour = () => (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-medium text-teal-600 text-center mb-8 px-4">
        Almost there! We just need one last thing from you...
      </h1>

      <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-4 md:mx-0 shadow-md/20">
        <h2 className="text-xl md:text-2xl font-medium text-gray-700 text-center mb-12 leading-relaxed">
          We need to know your exact location for us to know your nearest food
          places!
        </h2>

        <div className="flex justify-center">
          <button
            onClick={handleLocationToggle}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20 ${
              formData.locationEnabled
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md/20"
                : "bg-[#5A9785] hover:bg-teal-600 text-white shadow-md/20"
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
          className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
        >
          Go back
        </button>
        <button
          onClick={handleNext}
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
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
          {[1, 2, 3, 4].map((step) => (
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
        {currentStep === 4 && <StepFour />}
      </div>
    </div>
  );
}
