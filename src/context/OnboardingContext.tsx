import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    targetRoute?: string;
    highlightElement?: string;
    icon: React.ReactNode;
    details: string[];
}

interface OnboardingContextType {
    isFirstTime: boolean;
    currentStep: number;
    showOnboarding: boolean;
    setShowOnboarding: (show: boolean) => void;
    nextStep: () => void;
    previousStep: () => void;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
    totalSteps: number;
    currentRoute: string;
    setCurrentRoute: (route: string) => void;
    isPageReached: boolean;
    skipToStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [currentRoute, setCurrentRoute] = useState('/');
    const totalSteps = 6; // Welcome + 5 feature tutorials

    // Load onboarding state from localStorage on mount
    useEffect(() => {
        const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
        const savedStep = localStorage.getItem('onboarding_step');

        if (hasCompletedOnboarding === 'true') {
            setIsFirstTime(false);
            setShowOnboarding(false);
        } else {
            setIsFirstTime(true);
            setShowOnboarding(true);
            if (savedStep) {
                setCurrentStep(parseInt(savedStep));
            }
        }
    }, []);

    // Define routes for each step
    const routes: Record<number, string> = {
        0: '/consent', // Welcome - starts at consent (default landing page)
        1: '/dashboard',
        2: '/suspicious',
        3: '/audit-log',
        4: '/consent',
        5: '/settings',
    };

    // Check if user is on the correct page for current step
    const isPageReached = currentRoute === routes[currentStep];

    const nextStep = () => {
        setCurrentStep((prev) => {
            const next = prev + 1;
            if (next < totalSteps) {
                localStorage.setItem('onboarding_step', next.toString());
            }
            return next;
        });
    };

    const previousStep = () => {
        setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    const skipToStep = (step: number) => {
        setCurrentStep(step);
        localStorage.setItem('onboarding_step', step.toString());
    };

    const completeOnboarding = () => {
        localStorage.setItem('onboarding_completed', 'true');
        localStorage.removeItem('onboarding_step');
        setIsFirstTime(false);
        setShowOnboarding(false);
    };

    const resetOnboarding = () => {
        localStorage.removeItem('onboarding_completed');
        localStorage.removeItem('onboarding_step');
        setIsFirstTime(true);
        setCurrentStep(0);
        setShowOnboarding(true);
    };

    return (
        <OnboardingContext.Provider
            value={{
                isFirstTime,
                currentStep,
                showOnboarding,
                setShowOnboarding,
                nextStep,
                previousStep,
                completeOnboarding,
                resetOnboarding,
                totalSteps,
                currentRoute,
                setCurrentRoute,
                isPageReached,
                skipToStep,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within OnboardingProvider');
    }
    return context;
};
