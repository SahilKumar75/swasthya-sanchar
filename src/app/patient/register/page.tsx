"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { User, Calendar, Heart, Phone, Loader2, ChevronRight, ChevronLeft, Check, Activity, AlertCircle, MapPin, Upload, X } from "lucide-react";

const STEPS = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Address", icon: MapPin },
    { id: 3, title: "Medical Info", icon: Heart },
    { id: 4, title: "Emergency Contact", icon: AlertCircle },
];

export default function PatientRegister() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [profilePicture, setProfilePicture] = useState<string>("");
    const [profilePreview, setProfilePreview] = useState<string>("");
    const [loadingAddress, setLoadingAddress] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        // Personal Info
        fullName: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        phone: "",
        email: session?.user?.email || "",

        // Address
        streetAddress: "",
        pincode: "",
        city: "",
        state: "",

        // Medical Info
        height: "",
        weight: "",
        allergies: "",
        chronicConditions: "",
        currentMedications: "",

        // Emergency Contact
        emergencyName: "",
        emergencyRelationship: "",
        emergencyPhone: "",
    });

    // Redirect if not authenticated
    useEffect(() => {
        // Skip auth check in development if bypass is enabled
        if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
            setCheckingStatus(false);
            return;
        }

        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    // Check if already registered
    useEffect(() => {
        // Skip registration check in development if bypass is enabled
        if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
            setCheckingStatus(false);
            return;
        }

        const checkRegistrationStatus = async () => {
            if (!session) return;

            try {
                const res = await fetch("/api/patient/status");
                const data = await res.json();

                if (data.isRegisteredOnChain) {
                    // Already registered, redirect to home
                    router.push("/patient-portal/home");
                }
            } catch (error) {
                console.error("Error checking registration status:", error);
            } finally {
                setCheckingStatus(false);
            }
        };

        if (session) {
            checkRegistrationStatus();
        }
    }, [session, router]);

    if (status === "loading" || checkingStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Checking registration status...</p>
                </div>
            </div>
        );
    }

    if (!session && process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH !== 'true') {
        return null;
    }

    // Handle profile picture upload
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        // Convert to base64 and set preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setProfilePicture(base64String);
            setProfilePreview(base64String);
        };
        reader.readAsDataURL(file);
    };

    // Fetch address from Indian Postal API
    const fetchAddressFromPincode = async (pincode: string) => {
        if (pincode.length !== 6) return;

        setLoadingAddress(true);
        setError("");

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0];
                setFormData({
                    ...formData,
                    pincode,
                    city: postOffice.District,
                    state: postOffice.State
                });
            } else {
                setError("Invalid pincode. Please check and try again.");
            }
        } catch (err) {
            setError("Failed to fetch address. Please enter manually.");
        } finally {
            setLoadingAddress(false);
        }
    };

    const handleNext = () => {
        // Validate current step
        if (currentStep === 1) {
            if (!profilePicture || !formData.fullName || !formData.dateOfBirth || !formData.gender || !formData.bloodGroup || !formData.phone) {
                setError("Please fill in all required fields");
                return;
            }
        } else if (currentStep === 2) {
            if (!formData.streetAddress || !formData.pincode || !formData.city || !formData.state) {
                setError("Please fill in all required fields");
                return;
            }
            if (formData.pincode.length !== 6) {
                setError("Pincode must be 6 digits");
                return;
            }
        } else if (currentStep === 4) {
            if (!formData.emergencyName || !formData.emergencyRelationship || !formData.emergencyPhone) {
                setError("Please fill in all required fields");
                return;
            }
        }
        setError("");
        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setError("");
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate final step
        if (!formData.emergencyName || !formData.emergencyRelationship || !formData.emergencyPhone) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/patient/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dateOfBirth: formData.dateOfBirth,
                    profilePicture: profilePicture,
                    emergencyData: {
                        fullName: formData.fullName,
                        gender: formData.gender,
                        phone: formData.phone,
                        streetAddress: formData.streetAddress,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        bloodGroup: formData.bloodGroup,
                        height: formData.height,
                        weight: formData.weight,
                        allergies: formData.allergies,
                        chronicConditions: formData.chronicConditions,
                        currentMedications: formData.currentMedications,
                        emergencyName: formData.emergencyName,
                        emergencyRelationship: formData.emergencyRelationship,
                        emergencyPhone: formData.emergencyPhone,
                    },
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to register");
            }

            setSuccess("Registration successful! Redirecting...");
            console.log("Transaction hash:", data.transactionHash);

            // Redirect to home after 2 seconds
            setTimeout(() => {
                router.push("/patient-portal/home");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-12 pt-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                        Patient Registration
                    </h1>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = currentStep > step.id;
                            const isCurrent = currentStep === step.id;

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                ? "bg-green-500 text-white"
                                                : isCurrent
                                                    ? "bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/50"
                                                    : "bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400"
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <p
                                            className={`mt-2 text-sm font-medium ${isCurrent ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-neutral-400"
                                                }`}
                                        >
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div
                                            className={`h-1 w-20 mx-2 rounded transition-all ${isCompleted ? "bg-green-500" : "bg-gray-200 dark:bg-neutral-700"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-shadow p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">Personal Information</h3>

                                {/* Profile Picture Upload */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative">
                                        {profilePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={profilePreview}
                                                    alt="Profile Preview"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfilePicture("");
                                                        setProfilePreview("");
                                                    }}
                                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center border-4 border-dashed border-neutral-300 dark:border-neutral-600">
                                                <User className="w-16 h-16 text-neutral-400 dark:text-neutral-500" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="mt-4 cursor-pointer">
                                        <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition text-sm font-medium">
                                            <Upload className="w-4 h-4" />
                                            Upload Profile Picture <span className="text-red-300 ml-1">*</span>
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Required • Max 5MB</p>
                                </div>

                                {/* Full Name & DOB - Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                            Full Name <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        />
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                            Date of Birth <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>

                                {/* Gender & Blood Group - Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                            Gender <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select
                                            required
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>

                                    {/* Blood Group */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                            Blood Group <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select
                                            required
                                            value={formData.bloodGroup}
                                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Phone Number <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 9876543210"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Address Information */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Address Information</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Enter your residential address</p>
                                </div>

                                {/* Street Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Street Address <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.streetAddress}
                                        onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                        placeholder="House No., Building Name, Street"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Pincode & City - Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Pincode */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                            Pincode <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                value={formData.pincode}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                    setFormData({ ...formData, pincode: value });
                                                    if (value.length === 6) {
                                                        fetchAddressFromPincode(value);
                                                    }
                                                }}
                                                placeholder="Enter 6-digit pincode"
                                                maxLength={6}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                            />
                                            {loadingAddress && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">City and State will be auto-filled</p>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                            City <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="City"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        State <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        placeholder="State"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Medical Info */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Medical Information</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Optional but recommended for emergency situations</p>
                                </div>

                                {/* Height & Weight - Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Height */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                            Height (cm)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.height}
                                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                            placeholder="e.g., 170"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        />
                                    </div>

                                    {/* Weight */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            placeholder="e.g., 70"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>

                                {/* Allergies */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Known Allergies
                                    </label>
                                    <textarea
                                        value={formData.allergies}
                                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                        placeholder="e.g., Penicillin, Peanuts, Latex"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Chronic Conditions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Chronic Conditions
                                    </label>
                                    <textarea
                                        value={formData.chronicConditions}
                                        onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                                        placeholder="e.g., Diabetes, Hypertension, Asthma"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Current Medications */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Current Medications
                                    </label>
                                    <textarea
                                        value={formData.currentMedications}
                                        onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                                        placeholder="e.g., Aspirin 100mg daily, Metformin 500mg twice daily"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Emergency Contact */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Emergency Contact</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Who should we contact in case of emergency?</p>
                                </div>

                                {/* Emergency Contact Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Contact Name <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.emergencyName}
                                        onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                                        placeholder="Full name of emergency contact"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Relationship */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Relationship <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select
                                        required
                                        value={formData.emergencyRelationship}
                                        onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    >
                                        <option value="">Select Relationship</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="Child">Child</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Emergency Contact Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Contact Phone <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.emergencyPhone}
                                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                                        placeholder="+91 9876543210"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2 px-6 py-3 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Previous
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Complete Registration
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-4">
                            Your data will be securely stored on the blockchain
                        </p>
                    </form>
                </div>
            </div >

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div >
    );
}
