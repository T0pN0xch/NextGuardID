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
}

export default function ProfilePage({ userName, userIc }: ProfilePageProps) {
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
        <div className="space-y-6 p-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Profile</h1>
                    <p className="text-muted-foreground">Manage your account and personal information</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-primary-foreground" />
                </div>
            </div>

            {/* Main Profile Card */}
            <Card className="glass-elevated border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your identity and contact details</CardDescription>
                    </div>
                    {!isEditing && (
                        <Button
                            onClick={handleEdit}
                            variant="outline"
                            className="gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <div className="space-y-6">
                            {/* Name and IC */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={editData.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>IC Number</Label>
                                    <Input
                                        value={editData.icNumber}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={editData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            {/* Location and DOB */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Input
                                        type="date"
                                        value={editData.dateOfBirth}
                                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input
                                        value={editData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder="Enter address"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button onClick={handleSave} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="identity">Identity</TabsTrigger>
                            </TabsList>

                            {/* Personal Tab */}
                            <TabsContent value="personal" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div className="flex items-start gap-4">
                                        <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Full Name</p>
                                            <p className="text-lg font-semibold">{profileData.fullName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email Address</p>
                                            <p className="text-lg font-semibold">{profileData.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone Number</p>
                                            <p className="text-lg font-semibold">{profileData.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Address</p>
                                            <p className="text-lg font-semibold">{profileData.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date of Birth</p>
                                            <p className="text-lg font-semibold">
                                                {new Date(profileData.dateOfBirth).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Nationality</p>
                                            <p className="text-lg font-semibold">{profileData.nationality}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Identity Tab */}
                            <TabsContent value="identity" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div className="flex items-start gap-4">
                                        <CreditCard className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">MyKad Number</p>
                                            <p className="text-lg font-semibold font-mono">{formatIC(profileData.icNumber)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Account Status</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <p className="text-lg font-semibold text-green-600">{profileData.status}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Registration Date</p>
                                            <p className="text-lg font-semibold">
                                                {new Date(profileData.registrationDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Activity className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Verification Level</p>
                                            <p className="text-lg font-semibold">Level 3 (Verified)</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-elevated border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            Active Sessions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>

                <Card className="glass-elevated border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Documents
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-xs text-muted-foreground">Verified documents</p>
                    </CardContent>
                </Card>

                <Card className="glass-elevated border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            Security Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">95/100</p>
                        <p className="text-xs text-muted-foreground">Excellent security</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
