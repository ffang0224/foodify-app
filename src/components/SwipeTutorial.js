import React, { useState, useEffect } from 'react';
import { X, Heart, ArrowLeft, ArrowRight } from 'lucide-react';

const TutorialOverlay = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [show, setShow] = useState(true);

    const steps = [
        {
            title: "Welcome to Restaurant Finder!",
            description: "Let's show you how to find your next favorite place to eat.",
            position: "center",
        },
        {
            title: "Swipe Right to Like",
            description: "Found a restaurant you like? Swipe right or click the heart to add it to your playlist.",
            position: "right",
            icon: <Heart className="w-8 h-8 text-green-500 animate-pulse" />,
            animation: "translate-x-4"
        },
        {
            title: "Swipe Left to Skip",
            description: "Not interested? Swipe left or click the X to see the next restaurant.",
            position: "left",
            icon: <X className="w-8 h-8 text-red-500 animate-pulse" />,
            animation: "-translate-x-4"
        },
        {
            title: "View Details",
            description: "Click 'View Details' to see more information, reviews, and photos.",
            position: "bottom",
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            setShow(false);
            if (onComplete) onComplete();
        }
    };

    const handleSkip = () => {
        setShow(false);
        if (onComplete) onComplete();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl
            ${step === 1 ? 'animate-slide-right' : ''}
            ${step === 2 ? 'animate-slide-left' : ''}
            transform transition-all duration-300`}>

                        {/* Step indicator */}
                        <div className="flex justify-center mb-4">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${index === step ? 'bg-orange-500 w-4' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Icon */}
                        {steps[step].icon && (
                            <div className={`flex justify-center mb-4 transition-transform duration-500 ${steps[step].animation}`}>
                                {steps[step].icon}
                            </div>
                        )}

                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                            {steps[step].title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                            {steps[step].description}
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleSkip}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                Skip
                            </button>
                            <div className="flex items-center gap-2">
                                {step > 0 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    {step === steps.length - 1 ? "Get Started" : "Next"}
                                    {step < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;