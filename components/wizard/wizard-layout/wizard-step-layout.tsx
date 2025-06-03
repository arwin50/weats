"use client"

import type { ReactNode } from "react"

interface WizardStepLayoutProps {
    title: string
    subtitle: string
    children: ReactNode
    onBack?: () => void
    onNext: () => void
    showBackButton?: boolean
    nextButtonText?: string
}

export default function WizardStepLayout({
    title,
    subtitle,
    children,
    onBack,
    onNext,
    showBackButton = false,
    nextButtonText = "Next, please!",
}: WizardStepLayoutProps) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-medium text-teal-700 text-center mb-8 px-4">{title}</h1>

            <div className="bg-[#D5DBB5] rounded-3xl p-8 md:p-12 mx-auto md:mx-0 shadow-md/20 h-80 w-full max-w-2xl flex flex-col justify-center">
                <h2 className="text-xl md:text-2xl font-medium text-gray-700 text-center mb-12">{subtitle}</h2>

                <div className="flex-1 flex flex-col justify-center">{children}</div>
            </div>

            <div className="flex justify-center gap-8 mt-8 px-4">
                {showBackButton && onBack && (
                    <button
                        onClick={onBack}
                        className="w-50 bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
                    >
                        Go back
                    </button>
                )}
                <button
                    onClick={onNext}
                    className="w-50 bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer shadow-md/20"
                >
                    {nextButtonText}
                </button>
            </div>


        </div>
    )
}
