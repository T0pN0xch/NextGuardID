import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, CheckCircle2, X } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';

const tutorialSteps = [
    {
        id: 'welcome',
        title: '👋 Welcome to NextGuard ID',
        description: 'Your personal identity protection and usage tracking system powered by blockchain technology.',
        subtitle: "Let's get you started in just a few steps!",
        targetRoute: '/',
        details: [
            '✓ Secure MyKad digital identity management',
            '✓ Blockchain-verified audit trails',
            '✓ Complete consent control',
            '✓ Real-time security monitoring',
        ],
    },
    {
        id: 'dashboard',
        title: '📊 Dashboard Overview',
        description: 'Your personal command center showing all identity usage and security status at a glance.',
        subtitle: 'Monitor your identity usage in real-time',
        targetRoute: '/dashboard',
        details: [
            '• View total MyKad usage events',
            '• See recent usage by healthcare institutions',
            '• Track online (blockchain) vs offline transactions',
            '• Get insights into your digital footprint',
        ],
    },
    {
        id: 'audit',
        title: '🔐 Audit Log & History',
        description: 'Complete, immutable record of every time your MyKad is accessed or used.',
        subtitle: 'Full transparency and accountability',
        targetRoute: '/audit-log',
        details: [
            '• Search and filter all usage events',
            '• View blockchain verification details',
            '• Export audit records as JSON',
            '• Check transaction hash on Polygonscan',
        ],
    },
    {
        id: 'suspicious',
        title: '✋ Suspicious Activity Monitoring',
        description: 'Real-time alerts for unusual access patterns or potentially fraudulent identity usage.',
        subtitle: 'Stay protected from identity theft',
        targetRoute: '/suspicious',
        details: [
            '• Automatic anomaly detection',
            '• Location-based usage analysis',
            '• Risk level indicators',
            '• Instant notifications of suspicious activity',
        ],
    },
    {
        id: 'consent',
        title: '🤝 Consent Management',
        description: 'Control exactly which organizations can access your identity and for what purposes.',
        subtitle: "You're in complete control",
        targetRoute: '/consent',
        details: [
            '• Grant or revoke access instantly',
            '• Set consent expiration dates',
            '• View all pending approval requests',
            '• Track consent history',
        ],
    },
    {
        id: 'settings',
        title: '⚙️ Settings & Security',
        description: 'Customize your security preferences, manage notifications, and configure system settings.',
        subtitle: 'Tailor the system to your needs',
        targetRoute: '/settings',
        details: [
            '• Notification preferences',
            '• Security settings and 2FA',
            '• IPFS connection status',
            '• Wallet configuration',
        ],
    },
];

export const InteractiveGuide: React.FC = () => {
    const navigate = useNavigate();
    const {
        currentStep,
        showOnboarding,
        nextStep,
        previousStep,
        completeOnboarding,
        totalSteps,
        currentRoute,
        isPageReached,
    } = useOnboarding();

    // Auto-advance to next step when user reaches the target page
    useEffect(() => {
        if (showOnboarding && isPageReached && currentStep < totalSteps - 1) {
            const timer = setTimeout(() => {
                nextStep();
            }, 1500); // 1.5 second delay to let user see the success message
            return () => clearTimeout(timer);
        }
    }, [currentRoute, currentStep, isPageReached, showOnboarding, totalSteps, nextStep]);

    if (!showOnboarding) return null;

    const step = tutorialSteps[currentStep];
    const isLastStep = currentStep === totalSteps - 1;
    const isFirstStep = currentStep === 0;
    const needsNavigation = step.targetRoute && step.targetRoute !== currentRoute;

    const handleNavigate = () => {
        if (step.targetRoute) {
            navigate(step.targetRoute);
        }
    };

    return (
        <>
            {/* Spotlight Overlay */}
            {!isFirstStep && needsNavigation && (
                <div className="fixed inset-0 z-40 pointer-events-none">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                </div>
            )}

            {/* Floating Guide Card */}
            <div className="fixed bottom-8 right-8 z-50 max-w-md animate-slide-up">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Header with gradient background */}
                    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 px-6 py-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                                <p className="text-blue-100 text-xs mt-1">{step.subtitle}</p>
                            </div>
                            <button
                                onClick={completeOnboarding}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {step.description}
                        </p>

                        {/* Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                            {step.details.map((detail, idx) => (
                                <div key={idx} className="text-xs text-gray-700 leading-relaxed">
                                    {detail}
                                </div>
                            ))}
                        </div>

                        {/* Navigation Status */}
                        {needsNavigation && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                                <p className="text-xs text-amber-800">
                                    👉 <span className="font-semibold">Navigate to this page to continue</span> your tutorial
                                </p>
                            </div>
                        )}

                        {isPageReached && !needsNavigation && currentStep !== 0 && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6">
                                <p className="text-xs text-emerald-800 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="font-semibold">Great! You're on the right page.</span>
                                </p>
                            </div>
                        )}

                        {/* Progress */}
                        <div className="flex gap-1 mb-6 justify-center">
                            {Array.from({ length: totalSteps }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all ${idx === currentStep
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 w-6'
                                        : idx < currentStep
                                            ? 'bg-emerald-500 w-2'
                                            : 'bg-gray-300 w-2'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Step Counter */}
                        <p className="text-xs text-gray-500 text-center mb-4">
                            Step {currentStep + 1} of {totalSteps}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                onClick={previousStep}
                                variant="outline"
                                disabled={isFirstStep}
                                size="sm"
                                className="flex-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {needsNavigation ? (
                                <Button
                                    onClick={handleNavigate}
                                    size="sm"
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 gap-2"
                                >
                                    Go to Page
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={isLastStep ? completeOnboarding : nextStep}
                                    size="sm"
                                    className={`flex-1 gap-2 ${isLastStep
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                                        }`}
                                >
                                    {isLastStep ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Complete
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* Skip option */}
                        <p className="text-center text-xs text-gray-400 mt-4">
                            You can access this tutorial anytime from Settings
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InteractiveGuide;
