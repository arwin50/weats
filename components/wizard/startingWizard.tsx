"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import StepOne from "./wizard-layout/wizard-steps/step-one";
import StepTwo from "./wizard-layout/wizard-steps/step-two";
import StepThree from "./wizard-layout/wizard-steps/step-three";
import StepFour from "./wizard-layout/wizard-steps/step-four";

interface FormData {
  maxPrice: number;
  foodPreference: string;
  dietaryPreference: string;
  locationEnabled: boolean;
  locationCoords?: { lat: number; lng: number };
}

export default function StartingWizardRefactored() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    maxPrice: 75,
    foodPreference: "Surprise me, Choosee!",
    dietaryPreference: "Not choosy atm!",
    locationEnabled: false,
  });

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

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-[#FEF5E3] py-8 px-4 animate-gradient">
      {/* Logo placeholder */}
      <div className="absolute top-4 right-4 md:top-4 md:right-8">
        <Image
          src={logo}
          alt="Logo"
          width={130}
          height={130}
          className="object-contain"
        />
      </div>

      {/* Step indicator */}
      <div className="flex justify-center mb-8 mt-16 md:mt-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                step <= currentStep ? "bg-teal-500" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex justify-center items-center min-h-[60vh]">
        {currentStep === 1 && (
          <StepOne
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <StepTwo
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <StepThree
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <StepFour
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
