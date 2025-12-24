import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';

/**
 * Track route changes for the onboarding system
 * This hook should be used in the main layout component
 */
export const useOnboardingRouteTracker = () => {
  const { setCurrentRoute, showOnboarding } = useOnboarding();

  React.useEffect(() => {
    // Get current pathname from window location
    const currentPath = window.location.pathname;
    setCurrentRoute(currentPath);
  }, [setCurrentRoute]);

  // Return state for other uses
  return { showOnboarding };
};

/**
 * Sidebar hint that shows during onboarding
 */
export const OnboardingSidbarHint: React.FC = () => {
  const { showOnboarding, currentStep } = useOnboarding();

  if (!showOnboarding) return null;

  const hints: Record<number, { page: string; text: string }> = {
    1: { page: 'Dashboard', text: '📊 You are here' },
    2: { page: 'Audit Log', text: '🔐 Navigate here' },
    3: { page: 'Suspicious Activity', text: '✋ Navigate here' },
    4: { page: 'Consent', text: '🤝 Navigate here' },
    5: { page: 'Settings', text: '⚙️ Navigate here' },
  };

  const hint = hints[currentStep];
  if (!hint) return null;

  return (
    <div className="hidden sm:block text-xs text-blue-600 font-semibold px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 mx-3 mt-2">
      {hint.text}
    </div>
  );
};

export default useOnboardingRouteTracker;
