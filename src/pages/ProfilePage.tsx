import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    CheckCircle2,
    ExternalLink,
    Lock,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ProfilePageProps {
    userName: string;
    userIc: string;
    onUpdateUserName?: (newName: string) => void;
}

export default function ProfilePage({ userName, userIc }: ProfilePageProps) {
    const profileData = {
        fullName: userName,
        email: 'ahmad.abdullah@example.com',
        phone: '+60 12-3456 7890',
        address: 'Kuala Lumpur, Malaysia',
        dateOfBirth: '1988-01-01',
        nationality: 'Malaysian',
        registrationDate: '2024-01-15',
        icNumber: userIc,
        status: 'Active',
    };

    const formatIC = (ic: string) => {
        return ic.replace(/(\d{6})(\d{2})(\d{4})/, '$1-$2-$3');
    };

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">User Profile</h1>
                        <p className="text-gray-600 mt-2 text-lg">Your verified MyDigital ID profile (Read-Only)</p>
                    </div>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                        <User className="w-10 h-10 text-white" />
                    </div>
                </div>
            </div>

            {/* Security Information Card */}
            <Alert className="mb-8 border-2 border-blue-300 bg-blue-50">
                <Lock className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-900 font-bold">Secured by MyDigital ID</AlertTitle>
                <AlertDescription className="text-blue-800 mt-2">
                    Your profile information is sourced from Malaysia's official MyDigital ID system. All data is read-only for maximum security and compliance.
                    <a
                        href="https://www.digital-id.my/en/support"
                        target="https://www.digital-id.my/en/support"
                        rel="noopener noreferrer"
                        className="ml-2 font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                        Update your profile via MyDigital ID <ExternalLink className="w-4 h-4" />
                    </a>
                </AlertDescription>
            </Alert>

            {/* Personal Information Card - Read Only */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 mb-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        Personal Information
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Verified via MyDigital ID</p>
                </div>

                {/* Read-Only Profile Fields */}
                <div className="space-y-6">
                    {/* Full Name */}
                    <div className="flex items-start gap-4 pb-6 border-b-2 border-gray-100">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                            <p className="text-xl font-bold text-gray-900 mt-1">{profileData.fullName}</p>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified via MyDigital ID
                            </p>
                        </div>
                    </div>

                    {/* MyKad Number */}
                    <div className="flex items-start gap-4 pb-6 border-b-2 border-gray-100">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">MyKad Number</label>
                            <p className="text-xl font-bold text-gray-900 font-mono mt-1">{formatIC(profileData.icNumber)}</p>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified via MyDigital ID
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4 pb-6 border-b-2 border-gray-100">
                        <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                            <p className="text-lg font-bold text-gray-900 mt-1">{profileData.email}</p>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified via MyDigital ID
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4 pb-6 border-b-2 border-gray-100">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                            <p className="text-lg font-bold text-gray-900 mt-1">{profileData.phone}</p>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified via MyDigital ID
                            </p>
                        </div>
                    </div>


                </div>
            </div>

            {/* Additional Info Cards */}
            <div className="h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-green-200 rounded-full mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2 border-cyan-200 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-cyan-600" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold">Account Status</CardTitle>
                                <CardDescription>Current status</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-lg font-bold text-emerald-600">{profileData.status}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-emerald-200 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold">Registered On</CardTitle>
                                <CardDescription>Account creation date</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-bold text-gray-900">
                            {new Date(profileData.registrationDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold">Verification</CardTitle>
                                <CardDescription>MyDigital ID Status</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-bold text-purple-600">Verified ✓</p>
                    </CardContent>
                </Card>
            </div>

            {/* Security Notice */}
            <Alert className="mt-8 border-2 border-amber-300 bg-amber-50">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-900 font-bold">Why is your profile read-only?</AlertTitle>
                <AlertDescription className="text-amber-800 mt-2">
                    Your profile is sourced directly from Malaysia's official MyDigital ID system for maximum security. Making it read-only ensures:
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                        <li><strong>Immutability:</strong> Your identity cannot be tampered with</li>
                        <li><strong>Trust:</strong> Government-backed identity verification</li>
                        <li><strong>Compliance:</strong> Full regulatory alignment (PDPA, healthcare regulations)</li>
                        <li><strong>Audit Trail:</strong> All access is recorded on the blockchain</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    );
}
