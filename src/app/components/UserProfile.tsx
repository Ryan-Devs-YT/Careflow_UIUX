import { useState } from 'react';
import { ArrowLeft, Edit2, Save, X, Mail, Phone, Calendar, User, Heart, Bell, Palette, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface EmergencyContact {
    name: string;
    phone: string;
    relationship: string;
}

interface UserProfile {
    // Personal Information
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    avatar: string;

    // Health Information
    bloodType?: string;
    allergies: string[];
    conditions: string[];
    emergencyContact?: EmergencyContact;

    // Preferences
    notifications: boolean;
    reminders: boolean;
}

interface UserProfileProps {
    onBack: () => void;
    currentUser: string;
}

export function UserProfile({ onBack, currentUser }: UserProfileProps) {
    const [profile, setProfile] = useState<UserProfile>({
        id: 'user-1',
        fullName: currentUser,
        email: 'user@careflow.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-01-15',
        gender: 'prefer-not-to-say',
        avatar: '👤',

        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        conditions: ['Hypertension'],
        emergencyContact: {
            name: 'Jane Doe',
            phone: '+1 (555) 987-6543',
            relationship: 'Spouse'
        },

        notifications: true,
        reminders: true
    });

    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

    const handleEdit = (section: string) => {
        setEditingSection(section);
        setTempProfile(profile);
    };

    const handleCancel = () => {
        setEditingSection(null);
        setTempProfile(profile);
    };

    const handleSave = () => {
        setProfile(tempProfile);
        setEditingSection(null);
        toast.success('Profile updated successfully! ✓');
    };

    const updateTempProfile = (field: string, value: any) => {
        setTempProfile({ ...tempProfile, [field]: value });
    };

    const updateEmergencyContact = (field: string, value: string) => {
        setTempProfile({
            ...tempProfile,
            emergencyContact: {
                ...tempProfile.emergencyContact!,
                [field]: value
            }
        });
    };

    const addAllergy = (allergy: string) => {
        if (allergy.trim() && !tempProfile.allergies.includes(allergy.trim())) {
            setTempProfile({
                ...tempProfile,
                allergies: [...tempProfile.allergies, allergy.trim()]
            });
        }
    };

    const removeAllergy = (allergy: string) => {
        setTempProfile({
            ...tempProfile,
            allergies: tempProfile.allergies.filter(a => a !== allergy)
        });
    };

    const addCondition = (condition: string) => {
        if (condition.trim() && !tempProfile.conditions.includes(condition.trim())) {
            setTempProfile({
                ...tempProfile,
                conditions: [...tempProfile.conditions, condition.trim()]
            });
        }
    };

    const removeCondition = (condition: string) => {
        setTempProfile({
            ...tempProfile,
            conditions: tempProfile.conditions.filter(c => c !== condition)
        });
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 sticky top-0 z-50 shadow-md">
                <button onClick={onBack} className="flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-6 h-6" />
                    <span className="text-lg">Back</span>
                </button>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-1">My Profile</h1>
                    <p className="text-healing-sage-100">Manage your personal information</p>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Avatar & Basic Info */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl shadow-md p-6 text-center"
                >
                    <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-sm">
                        {profile.avatar}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{profile.fullName}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                </motion.div>

                {/* Personal Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl shadow-md p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-info-main" />
                            <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
                        </div>
                        {editingSection !== 'personal' ? (
                            <button
                                onClick={() => handleEdit('personal')}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-5 h-5 text-blue-600" />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-600" />
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <Save className="w-5 h-5 text-green-600" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                            {editingSection === 'personal' ? (
                                <input
                                    type="text"
                                    value={tempProfile.fullName}
                                    onChange={(e) => updateTempProfile('fullName', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-border bg-input-background rounded-lg focus:border-info-main focus:outline-none text-foreground"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{profile.fullName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                            {editingSection === 'personal' ? (
                                <input
                                    type="email"
                                    value={tempProfile.email}
                                    onChange={(e) => updateTempProfile('email', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-border bg-input-background rounded-lg focus:border-info-main focus:outline-none text-foreground"
                                />
                            ) : (
                                <p className="text-foreground font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    {profile.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-600 mb-1">Phone</label>
                            {editingSection === 'personal' ? (
                                <input
                                    type="tel"
                                    value={tempProfile.phone}
                                    onChange={(e) => updateTempProfile('phone', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            ) : (
                                <p className="text-neutral-800 font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-neutral-400" />
                                    {profile.phone}
                                </p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-600 mb-1">Date of Birth</label>
                            {editingSection === 'personal' ? (
                                <input
                                    type="date"
                                    value={tempProfile.dateOfBirth}
                                    onChange={(e) => updateTempProfile('dateOfBirth', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            ) : (
                                <p className="text-neutral-800 font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-neutral-400" />
                                    {new Date(profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-600 mb-1">Gender</label>
                            {editingSection === 'personal' ? (
                                <select
                                    value={tempProfile.gender}
                                    onChange={(e) => updateTempProfile('gender', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            ) : (
                                <p className="text-neutral-800 font-medium capitalize">
                                    {profile.gender.replace(/-/g, ' ')}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Health Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-2xl shadow-md p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-error-main" />
                            <h3 className="text-xl font-bold text-foreground">Health Information</h3>
                        </div>
                        {editingSection !== 'health' ? (
                            <button
                                onClick={() => handleEdit('health')}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-5 h-5 text-red-600" />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-600" />
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <Save className="w-5 h-5 text-green-600" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Blood Type */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-600 mb-1">Blood Type</label>
                            {editingSection === 'health' ? (
                                <select
                                    value={tempProfile.bloodType || ''}
                                    onChange={(e) => updateTempProfile('bloodType', e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-border bg-input-background rounded-lg focus:border-error-main focus:outline-none text-foreground"
                                >
                                    <option value="">Select blood type</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            ) : (
                                <p className="text-foreground font-medium">{profile.bloodType || 'Not specified'}</p>
                            )}
                        </div>

                        {/* Allergies */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-600 mb-1">Allergies</label>
                            {editingSection === 'health' ? (
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {tempProfile.allergies.map((allergy) => (
                                            <span
                                                key={allergy}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                                            >
                                                {allergy}
                                                <button
                                                    onClick={() => removeAllergy(allergy)}
                                                    className="hover:bg-red-200 rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Add allergy (press Enter)"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                addAllergy(e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                        className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-red-500 focus:outline-none"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {profile.allergies.length > 0 ? (
                                        profile.allergies.map((allergy) => (
                                            <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                                {allergy}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-neutral-500 text-sm">No allergies recorded</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Conditions */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-600 mb-1">Medical Conditions</label>
                            {editingSection === 'health' ? (
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {tempProfile.conditions.map((condition) => (
                                            <span
                                                key={condition}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                                            >
                                                {condition}
                                                <button
                                                    onClick={() => removeCondition(condition)}
                                                    className="hover:bg-orange-200 rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Add condition (press Enter)"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                addCondition(e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                        className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-red-500 focus:outline-none"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {profile.conditions.length > 0 ? (
                                        profile.conditions.map((condition) => (
                                            <span key={condition} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                                {condition}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-neutral-500 text-sm">No conditions recorded</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Emergency Contact */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Emergency Contact</label>
                            {editingSection === 'health' ? (
                                <div className="space-y-3 p-4 bg-background rounded-lg">
                                    <input
                                        type="text"
                                        value={tempProfile.emergencyContact?.name || ''}
                                        onChange={(e) => updateEmergencyContact('name', e.target.value)}
                                        placeholder="Contact Name"
                                        className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-error-main focus:outline-none bg-input-background text-foreground"
                                    />
                                    <input
                                        type="tel"
                                        value={tempProfile.emergencyContact?.phone || ''}
                                        onChange={(e) => updateEmergencyContact('phone', e.target.value)}
                                        placeholder="Contact Phone"
                                        className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-error-main focus:outline-none bg-input-background text-foreground"
                                    />
                                    <input
                                        type="text"
                                        value={tempProfile.emergencyContact?.relationship || ''}
                                        onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
                                        placeholder="Relationship"
                                        className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-error-main focus:outline-none bg-input-background text-foreground"
                                    />
                                </div>
                            ) : (
                                <div className="p-4 bg-background rounded-lg">
                                    {profile.emergencyContact ? (
                                        <>
                                            <p className="text-foreground font-medium">{profile.emergencyContact.name}</p>
                                            <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                                                <Phone className="w-4 h-4" />
                                                {profile.emergencyContact.phone}
                                            </p>
                                            <p className="text-muted-foreground text-sm mt-1">
                                                Relationship: {profile.emergencyContact.relationship}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No emergency contact set</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-md p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-purple-600" />
                            <h3 className="text-xl font-bold text-foreground">Preferences</h3>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Notifications */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-neutral-400" />
                                <div>
                                    <p className="font-medium text-foreground">Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive app notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setProfile({ ...profile, notifications: !profile.notifications })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${profile.notifications ? 'bg-primary' : 'bg-switch-background'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${profile.notifications ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Reminders */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-neutral-400" />
                                <div>
                                    <p className="font-medium text-foreground">Medication Reminders</p>
                                    <p className="text-sm text-muted-foreground">Get reminded to take meds</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setProfile({ ...profile, reminders: !profile.reminders })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${profile.reminders ? 'bg-primary' : 'bg-switch-background'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${profile.reminders ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
