import React from "react";

interface PreviousPromptOverlayProps {
  isVisible: boolean;
}

export function PreviousPromptOverlay({ isVisible }: PreviousPromptOverlayProps) {
  return (
    <div
      className={`fixed left-0 top-22 sm:top-25 h-[85%] w-[70%] sm:w-100 bg-[#FFF396] shadow-lg rounded-r-3xl z-50 overflow-y-auto text-black custom-scrollbar p-6 transform transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <h2 className="text-xl font-playfair font-bold mb-4">Previous Prompts</h2>
      <p>This is where your previous prompt content will go.</p>
    </div>
  );
}
