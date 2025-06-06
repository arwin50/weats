"use client";

import { MapPin } from "lucide-react";
import WizardStepLayout from "../wizard-step-layout";

interface FormData {
  maxPrice: number;
  foodPreference: string;
  dietaryPreference: string;
  locationEnabled: boolean;
}

interface StepFourProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFour({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepFourProps) {
  const handleLocationToggle = () => {
    updateFormData({ locationEnabled: !formData.locationEnabled });
  };

  return (
    <WizardStepLayout
      title="Almost here! We just need one last thing from you..."
      subtitle="We need to know your exact location for us to know your nearest food places!"
      onBack={onBack}
      onNext={onNext}
      showBackButton={true}
    >
      <div className="flex justify-center mb-6">
        <button
          onClick={handleLocationToggle}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-medium transition-colors cursor-pointer shadow-md/20 ${
            formData.locationEnabled
              ? "bg-[#D9D9D9] hover:bg-[#989898] text-black"
              : "bg-[#5A9785] hover:bg-teal-600 text-white"
          }`}
        >
          <MapPin className="w-5 h-5" />
          {formData.locationEnabled ? "Location Enabled" : "Enable location"}
        </button>
      </div>

      {formData.locationEnabled && (
        <div className="flex flex-row gap-4 justify-between sm:px-16">
          <button className="px-5 py-2 rounded-full bg-[#A97256] hover:bg-[#7b533f] text-white font-medium shadow-sm transition-colors flex flex-col items-center text-sm">
            <span className="text-lg">Choose Location</span>
            <span className="text-xs">Pick from the map</span>
          </button>

          <button className="px-5 py-2 rounded-full bg-[#E26F43] hover:bg-[#b6471c] text-white font-medium shadow-sm transition-colors flex flex-col items-center text-sm">
            <span className="text-lg">Current Location</span>
            <span className="text-xs">Use GPS to detect</span>
          </button>
        </div>
      )}
    </WizardStepLayout>
  );
}
