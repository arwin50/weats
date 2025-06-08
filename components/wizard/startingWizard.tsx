"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import StepOne from "./wizard-layout/wizard-steps/step-one";
import StepTwo from "./wizard-layout/wizard-steps/step-two";
import StepThree from "./wizard-layout/wizard-steps/step-three";
import StepFour from "./wizard-layout/wizard-steps/step-four";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setPromptData, completeWizard } from "@/lib/redux/slices/promptSlice";
import { ArrowLeft } from "lucide-react";
import { UserMenu } from "@/components/userMenu";

export default function StartingWizardRefactored() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.prompt);
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Mark wizard as completed before navigating
        dispatch(completeWizard());
        router.replace("/dashboard");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    dispatch(setPromptData(updates));
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FEF5E3] py-4 xs:py-6 sm:py-8 px-2 xs:px-3 sm:px-4 md:px-6 animate-gradient">
      <UserMenu />
      <button
        onClick={handleBackToDashboard}
        className="fixed top-4 xs:top-6 sm:top-7 left-14 xs:left-18 sm:left-22 z-50 flex items-center gap-1 sm:gap-2 bg-[#5A9785] hover:bg-[#477769] text-white py-1.5 xs:py-2 sm:py-3 px-2 xs:px-3 sm:px-6 rounded-lg shadow-lg transition-colors text-xs xs:text-sm sm:text-base cursor-pointer"
      >
        <ArrowLeft className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
        <span className="hidden xs:inline">Back to Dashboard</span>
        <span className="inline xs:hidden">Back</span>
      </button>

      {/* Logo */}
      <div className="absolute top-2 xs:top-3 right-2 xs:right-3 sm:top-4 sm:right-4 md:top-4 md:right-8">
        <Image
          src={logo || "/placeholder.svg"}
          alt="Logo"
          width={60}
          height={60}
          className="object-contain w-[60px] h-[60px] xs:w-[70px] xs:h-[70px] sm:w-[100px] sm:h-[100px] md:w-[130px] md:h-[130px]"
        />
      </div>

      {/* Step indicator */}
      <div className="flex justify-center mb-4 xs:mb-6 sm:mb-8 mt-10 xs:mt-12 sm:mt-16 md:mt-8">
        <div className="flex gap-1 xs:gap-1.5 sm:gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                step <= currentStep ? "bg-teal-500" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex justify-center items-center min-h-[45vh] xs:min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh]">
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
