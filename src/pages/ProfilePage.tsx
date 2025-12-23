import { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Activity,
    FileText,
    CreditCard,
    Edit2,
    Save,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface ProfilePageProps {
    userName: string;
    userIc: string;
    onUpdateUserName?: (newName: string) => void;
}

export default function ProfilePage({ userName, userIc, onUpdateUserName }: ProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: userName,
        email: 'ahmad.abdullah@example.com',
        phone: '+60 12-3456 7890',
        address: 'Kuala Lumpur, Malaysia',
        dateOfBirth: '1988-01-01',
        nationality: 'Malaysian',
        registrationDate: '2024-01-15',
        icNumber: userIc,
        status: 'Active',
    });

    const [editData, setEditData] = useState(profileData);

    const handleEdit = () => {
        setIsEditing(true);
        setEditData(profileData);
    };

    const handleSave = () => {
        setProfileData(editData);
        setIsEditing(false);
        // Update parent component with new name
        if (onUpdateUserName) {
            onUpdateUserName(editData.fullName);
        }
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved successfully.",
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(profileData);
    };

    const handleChange = (field: string, value: string) => {
        setEditData({
            ...editData,
            [field]: value,
        });
    };

    const formatIC = (ic: string) => {
        return ic.replace(/(\d{6})(\d{2})(\d{4})/, '$1-$2-$3');
    };

    return (
        <div className="p-8 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">User Profile</h1>
                        <p className="text-gray-600 mt-2 text-lg">Manage your account and personal information</p>
                    </div>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                        <User className="w-10 h-10 text-white" />
                    </div>
                </div>
            </div>

            {/* Main Profile Card */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 mb-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                        <p className="text-gray-600 text-sm mt-1">Your identity and contact details</p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-8">
                        {/* Name and IC */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Full Name</Label>
                                <Input
                                    value={editData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    placeholder="Enter full name"
                                    className="h-12 border-2 border-gray-300 rounded-lg focus:border-blue-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">IC Number</Label>
                                <Input
                                    value={editData.icNumber}
                                    disabled
                                    className="h-12 bg-gray-100 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Email Address</Label>
                                <Input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="Enter email"
                                    className="h-12 border-2 border-gray-300 rounded-lg focus:border-blue-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Phone Number</Label>
                                <Input
                                    value={editData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    placeholder="Enter phone number"
                                    className="h-12 border-2 border-gray-300 rounded-lg focus:border-blue-600"
                                />
                            </div>
                        </div>

                        {/* Location and DOB */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={editData.dateOfBirth}
                                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                    className="h-12 border-2 border-gray-300 rounded-lg focus:border-blue-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Address</Label>
                                <Input
                                    value={editData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    placeholder="Enter address"
                                    className="h-12 border-2 border-gray-300 rounded-lg focus:border-blue-600"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold">Personal</TabsTrigger>
                            <TabsTrigger value="identity" className="data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold">Identity</TabsTrigger>
                        </TabsList>

                        {/* Personal Tab */}
                        <TabsContent value="personal" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <User className="w-6 h-6 text-blue-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Full Name</p>
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{profileData.fullName}</p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Mail className="w-6 h-6 text-purple-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Email</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 break-all">{profileData.email}</p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-lg hover:shadow-green-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Phone className="w-6 h-6 text-green-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Phone</p>
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{profileData.phone}</p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200 hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <MapPin className="w-6 h-6 text-orange-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Address</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">{profileData.address}</p>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200 hover:shadow-lg hover:shadow-red-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="w-6 h-6 text-red-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Date of Birth</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {new Date(profileData.dateOfBirth).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Shield className="w-6 h-6 text-indigo-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Nationality</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">{profileData.nationality}</p>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Identity Tab */}
                        <TabsContent value="identity" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">MyKad Number</p>
                                    </div>
                                    <p className="text-lg font-bold font-mono text-gray-900">{formatIC(profileData.icNumber)}</p>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Shield className="w-6 h-6 text-emerald-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Account Status</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <p className="text-lg font-bold text-emerald-600">{profileData.status}</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200 hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="w-6 h-6 text-orange-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Registered On</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {new Date(profileData.registrationDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Activity className="w-6 h-6 text-purple-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Verification</p>
                                    </div>
                                    <p className="text-lg font-bold text-purple-600">Level 3 (Verified)</p>
                                </div>

                                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border-2 border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <FileText className="w-6 h-6 text-cyan-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">2FA Status</p>
                                    </div>
                                    <p className="text-lg font-bold text-cyan-600">Enabled ✓</p>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Shield className="w-6 h-6 text-indigo-600" />
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Data Privacy</p>
                                    </div>
                                    <p className="text-lg font-bold text-indigo-600">Protected</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            {/* Additional Stats Cards */}
            <div className="h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-green-200 rounded-full mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border-2 border-cyan-200 p-6 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">
                            <Activity className="w-7 h-7 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Active Sessions</p>
                            <p className="text-3xl font-bold text-gray-900">2</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Currently active</p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-2">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                            <FileText className="w-7 h-7 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Documents</p>
                            <p className="text-3xl font-bold text-gray-900">5</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Verified documents</p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-2">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Shield className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Security Score</p>
                            <p className="text-3xl font-bold text-emerald-600">95/100</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Excellent security</p>
                </div>
            </div>
        </div>
    );
}
