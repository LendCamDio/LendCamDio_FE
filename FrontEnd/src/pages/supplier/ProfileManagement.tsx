import { useState, useEffect } from "react";
import { User, Mail, Phone, Building, MapPin, Star, Camera, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import api from "@/services/api";
import { UserStatus, VerificationStatus } from "@/types/entity.type";
import IdentityVerificationSection from "@/components/supplier/IdentityVerificationSection";

interface UserProfile {
    userId: string;
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    role: string;
    status: UserStatus; // 0=Active, 1=Inactive
    isVerified: boolean;
}

interface SupplierProfile {
    supplierId: string;
    userId: string;
    companyName: string;
    address?: string;
    phone?: string;
    rating: number;
    verificationStatus: VerificationStatus; // 0=Pending, 1=Verified, 2=Rejected
    status: number; // 0=Active, 1=Inactive
}

export default function ProfileManagement() {
    const { user } = useAuth();
    const showToast = useUniqueToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [supplierProfile, setSupplierProfile] = useState<SupplierProfile | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        companyName: "",
        address: "",
        supplierPhone: "",
    });

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            setLoading(true);

            const userResponse = await api.get(`/api/users/profile/detailed`);
            setUserProfile(userResponse.data.data);

            const supplierResponse = await api.get(`/api/suppliers/user/${user?.id}`);

            if (!supplierResponse.data.success || !supplierResponse.data.data) {
                showToast("Supplier profile not found. Please verify your email or contact administrator.", "error");
                setLoading(false);
                return;
            }

            setSupplierProfile(supplierResponse.data.data);

            setFormData({
                fullName: userResponse.data.data.fullName || "",
                phone: userResponse.data.data.phone || "",
                companyName: supplierResponse.data.data.companyName || "",
                address: supplierResponse.data.data.address || "",
                supplierPhone: supplierResponse.data.data.phone || "",
            });

            setPreviewUrl(userResponse.data.data.avatarUrl || "");
        } catch (error: any) {
            if (error.response?.status === 404) {
                showToast("Supplier profile not found. Please verify your email or contact administrator.", "error");
            } else {
                showToast("Failed to load profile", "error");
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast("File size must be less than 5MB", "error");
                return;
            }

            if (!file.type.startsWith("image/")) {
                showToast("Please select an image file", "error");
                return;
            }

            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);

            await api.put(`/api/users/${userProfile?.userId}`, {
                fullName: formData.fullName,
                phone: formData.phone,
            });

            await api.put(`/api/suppliers/${supplierProfile?.supplierId}`, {
                companyName: formData.companyName,
                address: formData.address,
                phone: formData.supplierPhone,
            });

            if (avatarFile) {
                const formDataAvatar = new FormData();
                formDataAvatar.append("file", avatarFile);
                await api.patch(`/api/users/${userProfile?.userId}/avatar`, formDataAvatar, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            showToast("Profile updated successfully", "success");
            setEditMode(false);
            setAvatarFile(null);
            fetchProfiles();
        } catch (error) {
            showToast("Failed to update profile", "error");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setAvatarFile(null);
        setFormData({
            fullName: userProfile?.fullName || "",
            phone: userProfile?.phone || "",
            companyName: supplierProfile?.companyName || "",
            address: supplierProfile?.address || "",
            supplierPhone: supplierProfile?.phone || "",
        });
        setPreviewUrl(userProfile?.avatarUrl || "");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
                        <p className="text-gray-600">Manage your account and supplier information</p>
                    </div>
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                    <div className="px-6 pb-6">
                        <div className="relative -mt-16 mb-4">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                            <User className="w-16 h-16 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                {editMode && (
                                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition">
                                        <Camera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">User Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Full Name
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                                {userProfile?.fullName || "N/A"}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email
                                        </label>
                                        <p className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 cursor-not-allowed">
                                            {userProfile?.email || "N/A"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Phone
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                                {userProfile?.phone || "N/A"}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Account Status
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${userProfile?.status === UserStatus.ACTIVE
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {userProfile?.status === UserStatus.ACTIVE ? "Active" : "Inactive"}
                                            </span>
                                            {userProfile?.isVerified && (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    Email Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Supplier Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Building className="w-4 h-4 inline mr-2" />
                                            Company Name
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                                {supplierProfile?.companyName || "N/A"}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Business Phone
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="tel"
                                                value={formData.supplierPhone}
                                                onChange={(e) => setFormData({ ...formData, supplierPhone: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                                {supplierProfile?.phone || "N/A"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            Address
                                        </label>
                                        {editMode ? (
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                                {supplierProfile?.address || "N/A"}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Star className="w-4 h-4 inline mr-2" />
                                            Rating
                                        </label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-yellow-600">
                                                    {supplierProfile?.rating?.toFixed(1) || "0.0"}
                                                </span>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-5 h-5 ${star <= (supplierProfile?.rating || 0)
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Verification Status
                                        </label>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                supplierProfile?.verificationStatus === VerificationStatus.Verified
                                                    ? "bg-green-100 text-green-800"
                                                    : supplierProfile?.verificationStatus === VerificationStatus.Pending
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {supplierProfile?.verificationStatus === VerificationStatus.Verified
                                                ? "Verified"
                                                : supplierProfile?.verificationStatus === VerificationStatus.Pending
                                                    ? "Pending"
                                                    : "Rejected"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {editMode && (
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Identity Verification Section */}
                    <div className="mt-6">
                        <IdentityVerificationSection showToast={showToast} />
                    </div>
                </div>
            </div>
        </div>
    );
}
