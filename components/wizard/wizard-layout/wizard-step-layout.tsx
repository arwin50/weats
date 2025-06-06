"use client";

import type { ReactNode } from "react";

interface WizardStepLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  showBackButton?: boolean;
  nextButtonText?: string;
  wide?: boolean;
  nextButtonDisabled?: boolean;
}

export default function WizardStepLayout({
  title,
  subtitle,
  children,
  onBack,
  onNext,
  showBackButton = false,
  nextButtonText = "Next, please!",
  wide = false,
  nextButtonDisabled = false,
}: WizardStepLayoutProps) {
  return (
    <div className={`w-full ${wide ? "max-w-5xl" : "max-w-2xl"} mx-auto`}>
      {/* Title block with fixed min-height to avoid layout shift */}
      <div className="min-h-[4.5rem] md:min-h-[5rem] flex items-center justify-center px-4 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl text-teal-700">{title}</h1>
      </div>

      <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-auto shadow-md/20 w-full flex flex-col gap-6">
        {/* Subtitle */}
        <div className="min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center text-center">
          <h2 className="text-xl md:text-3xl text-gray-700">{subtitle}</h2>
        </div>

        {/* Children */}
        <div className="flex-1 flex flex-col justify-center">{children}</div>
      </div>

      {/* Buttons */}
      {/* Buttons */}
      <div className="flex justify-center gap-8 mt-8 px-4">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="w-50 bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl text-lg font-medium transition-colors cursor-pointer shadow-md/20"
          >
            Go back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={nextButtonDisabled}
          className={`w-50 px-8 py-3 rounded-xl text-lg font-medium transition-colors shadow-md/20
      ${
        nextButtonDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-400 hover:bg-red-500 text-white cursor-pointer"
      }`}
        >
          {nextButtonText}
        </button>
      </div>
    </div>
  );
}
