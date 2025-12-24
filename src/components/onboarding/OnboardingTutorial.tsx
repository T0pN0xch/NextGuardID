import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowRight,
    CheckCircle2,
    Shield,
    Lock,
    Eye,
    Settings,
    Home,
    X,
} from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';

const tutorialSteps = [
    {
        title: '👋 Welcome to NextGuard ID',
        description: 'Your personal identity protection and usage tracking system powered by blockchain technology.',
        subtitle: 'Let\'s get you started in just a few steps!',
        icon: Shield,
        color: 'from-blue-500 to-cyan-500',
        details: [
            '✓ Secure MyKad digital identity management',
            '✓ Blockchain-verified audit trails',
            '✓ Complete consent control',
            '✓ Real-time security monitoring',
        ],
    },
    {
        title: '📊 Dashboard Overview',
        description: 'Your personal command center showing all identity usage and security status at a glance.',
        subtitle: 'Monitor your identity usage in real-time',
        icon: Home,
        color: 'from-purple-500 to-pink-500',
        details: [
            '• View total MyKad usage events',
            '• See recent usage by healthcare institutions',
            '• Track online (blockchain) vs offline transactions',
            '• Get insights into your digital footprint',
        ],
    },
    {
        title: '🔐 Audit Log & History',
        description: 'Complete, immutable record of every time your MyKad is accessed or used.',
        subtitle: 'Full transparency and accountability',
        icon: Lock,
        color: 'from-emerald-500 to-teal-500',
        details: [
            '• Search and filter all usage events',
            '• View blockchain verification details',
            '• Export audit records as JSON',
            '• Check transaction hash on Polygonscan',
        ],
    },
    {
        title: '✋ Suspicious Activity Monitoring',
        description: 'Real-time alerts for unusual access patterns or potentially fraudulent identity usage.',
        subtitle: 'Stay protected from identity theft',
        icon: Eye,
        color: 'from-orange-500 to-red-500',
        details: [
            '• Automatic anomaly detection',
            '• Location-based usage analysis',
            '• Risk level indicators',
            '• Instant notifications of suspicious activity',
        ],
    },
    {
        title: '🤝 Consent Management',
        description: 'Control exactly which organizations can access your identity and for what purposes.',
        subtitle: 'You\'re in complete control',
        icon: CheckCircle2,
        color: 'from-indigo-500 to-blue-500',
        details: [
            '• Grant or revoke access instantly',
            '• Set consent expiration dates',
            '• View all pending approval requests',
            '• Track consent history',
        ],
    },
    {
        title: '⚙️ Settings & Security',
        description: 'Customize your security preferences, manage notifications, and configure system settings.',
        subtitle: 'Tailor the system to your needs',
        icon: Settings,
        color: 'from-rose-500 to-pink-500',
        details: [
            '• Notification preferences',
            '• Security settings and 2FA',
            '• IPFS connection status',
            '• Wallet configuration',
        ],
    },
];

export const OnboardingTutorial: React.FC = () => {
    const {
        currentStep,
        showOnboarding,
        nextStep,
        previousStep,
        completeOnboarding,
        totalSteps,
    } = useOnboarding();

    if (!showOnboarding) return null;

    const step = tutorialSteps[currentStep];
    const StepIcon = step.icon;
    const isLastStep = currentStep === totalSteps - 1;
    const isFirstStep = currentStep === 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="w-full max-w-2xl shadow-2xl border-0 animate-scale-in">
                <CardContent className="p-0">
                    {/* Close Button */}
                    <button
                        onClick={completeOnboarding}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Background gradient header */}
                    <div className={`bg-gradient-to-r ${step.color} h-32 flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute w-40 h-40 rounded-full blur-3xl" style={{ top: -20, right: -20 }}></div>
                        </div>
                        <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm z-10">
                            <StepIcon className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Title and Description */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
                            <p className="text-gray-600 mb-3">{step.description}</p>
                            <p className="text-sm text-blue-600 font-medium">{step.subtitle}</p>
                        </div>

                        {/* Details List */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-3">
                            {step.details.map((detail, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: step.color.split(' ')[1].replace('to-', '').replace('500', '') }}></div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{detail}</p>
                                </div>
                            ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="flex gap-2 mb-8 justify-center">
                            {Array.from({ length: totalSteps }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-2 rounded-full transition-all ${idx === currentStep
                                            ? `bg-gradient-to-r ${step.color} w-8`
                                            : idx < currentStep
                                                ? 'bg-green-500 w-2'
                                                : 'bg-gray-300 w-2'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-gray-500">
                                Step {currentStep + 1} of {totalSteps}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={previousStep}
                                    variant="outline"
                                    disabled={isFirstStep}
                                    className="min-w-[120px]"
                                >
                                    ← Previous
                                </Button>

                                <Button
                                    onClick={isLastStep ? completeOnboarding : nextStep}
                                    className={`min-w-[120px] ${isLastStep
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                                            : ''
                                        }`}
                                >
                                    {isLastStep ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Complete
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Skip option */}
                        <p className="text-center text-xs text-gray-500 mt-4">
                            You can re-access this tutorial anytime from Settings
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OnboardingTutorial;
