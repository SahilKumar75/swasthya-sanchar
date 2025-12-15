"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Navbar } from "@/components/Navbar";
import {
  User, Mail, Phone, Calendar, MapPin, Award, Building,
  FileText, Shield, CheckCircle, AlertCircle, ArrowRight, Edit2, X, Save, BadgeCheck, QrCode, Upload
} from "lucide-react";
import { INDIAN_STATES, getCitiesForState } from "@/lib/indianPostal";
import { CustomSelect } from "@/components/ui/custom-select";

interface DoctorData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialization: string;
  qualification: string;
  experience: string;
  hospital: string;
  city: string;
  state: string;
  walletAddress: string;
  isAuthorized: boolean;
  profilePicture?: string;
}

export default function DoctorProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<DoctorData | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [profilePreview, setProfilePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    // Step 1: Personal & Contact Information
    name: "",
    phone: "",
    licenseNumber: "",

    // Step 2: Professional Details
    specialization: "",
    qualification: "",
    experience: "",
    hospital: "",

    // Step 3: Location Information
    city: "",
    state: ""
  });

  // Handle state change and update available cities
  function handleStateChange(state: string) {
    setFormData({ ...formData, state, city: "" });
    setAvailableCities(getCitiesForState(state));
  }

  // Handle profile picture upload
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
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



  useEffect(() => {
    async function checkAuth() {
      // Development bypass - skip auth checks if enabled
      if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
        console.log('[DEV BYPASS] 🔓 Doctor portal - auth bypass enabled');
        setLoading(false);
        await loadMockDoctorData();
        return;
      }

      if (status === "loading") return;

      if (status === "unauthenticated" || !session?.user) {
        router.push("/auth/login");
        return;
      }

      if (session.user.role !== "doctor") {
        router.push(session.user.role === "patient" ? "/patient-portal" : "/");
        return;
      }

      setLoading(false);
      await loadDoctorData();
    }

    checkAuth();
  }, [session, status, router]);

  async function loadMockDoctorData() {
    // Mock data for development
    const mockData: DoctorData = {
      name: "Dr. John Doe",
      email: "doctor@example.com",
      phone: "+91 9876543210",
      licenseNumber: "MCI-123456",
      specialization: "Cardiologist",
      qualification: "MBBS, MD",
      experience: "10+ years",
      hospital: "City General Hospital",
      city: "Mumbai",
      state: "Maharashtra",
      walletAddress: "0xmock",
      isAuthorized: true
    };
    setDoctorData(mockData);
    setIsRegistered(false); // Changed to false to show registration form
    setFormData({
      name: mockData.name,
      phone: mockData.phone,
      licenseNumber: mockData.licenseNumber,
      specialization: mockData.specialization,
      qualification: mockData.qualification,
      experience: mockData.experience,
      hospital: mockData.hospital,
      city: mockData.city,
      state: mockData.state
    });
    setEditFormData({
      name: mockData.name,
      email: mockData.email,
      phone: mockData.phone,
      licenseNumber: mockData.licenseNumber,
      specialization: mockData.specialization,
      qualification: mockData.qualification,
      experience: mockData.experience,
      hospital: mockData.hospital,
      city: mockData.city,
      state: mockData.state,
      walletAddress: mockData.walletAddress,
      isAuthorized: mockData.isAuthorized
    });
    setAvailableCities(getCitiesForState(mockData.state));
  }

  async function loadDoctorData() {
    try {
      // Fetch doctor profile from database
      const response = await fetch("/api/doctor/profile");
      const data = await response.json();

      if (data.doctor) {
        // Load existing doctor data
        const dbData: DoctorData = {
          name: data.doctor.name,
          email: data.doctor.email || session?.user?.email || "",
          phone: data.doctor.phone || "",
          licenseNumber: data.doctor.licenseNumber,
          specialization: data.doctor.specialization || "",
          qualification: data.doctor.qualification || "",
          experience: data.doctor.experience || "",
          hospital: data.doctor.hospital || "",
          city: data.doctor.city || "",
          state: data.doctor.state || "",
          walletAddress: "",
          isAuthorized: true
        };

        setDoctorData(dbData);
        setIsRegistered(true);
        setFormData({
          name: dbData.name,
          phone: dbData.phone,
          licenseNumber: dbData.licenseNumber,
          specialization: dbData.specialization,
          qualification: dbData.qualification,
          experience: dbData.experience,
          hospital: dbData.hospital,
          city: dbData.city,
          state: dbData.state
        });
        setEditFormData({
          name: dbData.name,
          email: dbData.email,
          phone: dbData.phone,
          licenseNumber: dbData.licenseNumber,
          specialization: dbData.specialization,
          qualification: dbData.qualification,
          experience: dbData.experience,
          hospital: dbData.hospital,
          city: dbData.city,
          state: dbData.state,
          walletAddress: dbData.walletAddress,
          isAuthorized: dbData.isAuthorized
        });
        if (dbData.state) {
          setAvailableCities(getCitiesForState(dbData.state));
        }
      } else {
        // No profile yet - show empty form
        setIsRegistered(false);
        setFormData({
          name: session?.user?.email?.split("@")[0] || "",
          phone: "",
          licenseNumber: "",
          specialization: "",
          qualification: "",
          experience: "",
          hospital: "",
          city: "",
          state: ""
        });
      }
    } catch (error) {
      console.error("Error loading doctor data:", error);
      setIsRegistered(false);
    }
  }

  async function handleRegister() {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.phone || !formData.licenseNumber || !formData.state || !formData.city) {
        alert("Please fill in all required fields");
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!formData.specialization || !formData.qualification || !formData.experience) {
        alert("Please fill in all professional details");
        return;
      }
      // Step 2 is the last step - submit to database
    }

    // Final submission
    try {
      setRegistering(true);

      const response = await fetch("/api/doctor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save profile");
      }

      const data = await response.json();
      router.push("/doctor-portal/home");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message || "Failed to register. Please try again.");
    } finally {
      setRegistering(false);
    }
  }

  async function handleUpdateProfile() {
    try {
      setLoading(true);

      const response = await fetch("/api/doctor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }

      const data = await response.json();
      alert(data.message || "Profile updated successfully!");

      setIsEditing(false);
      // Reload doctor data
      await loadDoctorData();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100"></div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
              {isRegistered ? "My Portal" : "Complete Your Profile"}
            </h1>
            {isRegistered && doctorData?.isAuthorized && (
              <div className="group relative">
                <div className="relative w-8 h-8 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white dark:text-neutral-900" fill="white" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Verified Doctor
                </div>
              </div>
            )}
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {isRegistered
              ? "Manage your professional information and access doctor portal"
              : "Let's set up your professional profile to get started"
            }
          </p>
        </div>

        {/* Step-wise Registration for New Doctors */}
        {!isRegistered ? (
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                {[
                  { id: 1, title: "Personal & Location", icon: User },
                  { id: 2, title: "Professional Details", icon: Award }
                ].map((step, index) => {
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
                            <CheckCircle className="w-6 h-6" />
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
                      {index < 1 && (
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

            {/* Success message during registration */}
            {registering && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                <p className="text-blue-900 dark:text-blue-100 font-medium">
                  Saving your profile... Please wait
                </p>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-shadow p-8">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                {currentStep === 1 && "Personal Information & Location"}
                {currentStep === 2 && "Professional Details"}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {currentStep === 1 && "Let's start with your basic details, contact information, and location"}
                {currentStep === 2 && "Tell us about your professional qualifications and expertise"}
              </p>

              <div className="space-y-6">
                {/* Step 1: Personal & Contact Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
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
                          Upload Profile Picture
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Optional • Max 5MB</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          Full Name <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Dr. John Doe"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          Medical License Number <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          placeholder="e.g., MCI-123456"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          Phone Number <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          State <span className="text-red-500 ml-1">*</span>
                        </label>
                        <CustomSelect
                          value={formData.state}
                          onChange={handleStateChange}
                          options={[
                            { value: "", label: "Select State" },
                            ...INDIAN_STATES.map(state => ({ value: state, label: state }))
                          ]}
                          placeholder="Select State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          City <span className="text-red-500 ml-1">*</span>
                        </label>
                        {availableCities.length > 0 ? (
                          <>
                            <CustomSelect
                              value={formData.city}
                              onChange={(value) => setFormData({ ...formData, city: value })}
                              options={[
                                { value: "", label: "Select City" },
                                ...availableCities.map(city => ({ value: city, label: city })),
                                { value: "other", label: "Other (Type below)" }
                              ]}
                              placeholder="Select City"
                            />
                            {formData.city === "other" && (
                              <input
                                type="text"
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="Type your city name"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition mt-2"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Enter city name"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          Specialization <span className="text-red-500 ml-1">*</span>
                        </label>
                        <CustomSelect
                          value={formData.specialization}
                          onChange={(value) => setFormData({ ...formData, specialization: value })}
                          options={[
                            { value: "", label: "Select Specialization" },
                            { value: "General Physician", label: "General Physician" },
                            { value: "Cardiologist", label: "Cardiologist" },
                            { value: "Dermatologist", label: "Dermatologist" },
                            { value: "ENT Specialist", label: "ENT Specialist" },
                            { value: "Gastroenterologist", label: "Gastroenterologist" },
                            { value: "Gynecologist", label: "Gynecologist" },
                            { value: "Neurologist", label: "Neurologist" },
                            { value: "Oncologist", label: "Oncologist" },
                            { value: "Ophthalmologist", label: "Ophthalmologist" },
                            { value: "Orthopedic", label: "Orthopedic" },
                            { value: "Pediatrician", label: "Pediatrician" },
                            { value: "Psychiatrist", label: "Psychiatrist" },
                            { value: "Pulmonologist", label: "Pulmonologist" },
                            { value: "Radiologist", label: "Radiologist" },
                            { value: "Urologist", label: "Urologist" },
                            { value: "Other", label: "Other" }
                          ]}
                          placeholder="Select Specialization"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          Qualification <span className="text-red-500 ml-1">*</span>
                        </label>
                        <CustomSelect
                          value={formData.qualification}
                          onChange={(value) => setFormData({ ...formData, qualification: value })}
                          options={[
                            { value: "", label: "Select Qualification" },
                            { value: "MBBS", label: "MBBS" },
                            { value: "MBBS, MD", label: "MBBS, MD" },
                            { value: "MBBS, MS", label: "MBBS, MS" },
                            { value: "MBBS, DNB", label: "MBBS, DNB" },
                            { value: "MBBS, DM", label: "MBBS, DM" },
                            { value: "MBBS, MCh", label: "MBBS, MCh" },
                            { value: "BDS", label: "BDS" },
                            { value: "BDS, MDS", label: "BDS, MDS" },
                            { value: "BAMS", label: "BAMS" },
                            { value: "BHMS", label: "BHMS" },
                            { value: "BUMS", label: "BUMS" },
                            { value: "Other", label: "Other" }
                          ]}
                          placeholder="Select Qualification"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          Years of Experience <span className="text-red-500 ml-1">*</span>
                        </label>
                        <CustomSelect
                          value={formData.experience}
                          onChange={(value) => setFormData({ ...formData, experience: value })}
                          options={[
                            { value: "", label: "Select Experience" },
                            { value: "Less than 1 year", label: "Less than 1 year" },
                            { value: "1-2 years", label: "1-2 years" },
                            { value: "3-5 years", label: "3-5 years" },
                            { value: "6-10 years", label: "6-10 years" },
                            { value: "11-15 years", label: "11-15 years" },
                            { value: "16-20 years", label: "16-20 years" },
                            { value: "20+ years", label: "20+ years" }
                          ]}
                          placeholder="Select Experience"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                          Hospital/Clinic Name
                        </label>
                        <input
                          type="text"
                          value={formData.hospital}
                          onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                          placeholder="e.g., City General Hospital"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>
                )}


                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      disabled={registering}
                      className="flex items-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition disabled:opacity-50 font-medium"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {registering ? "Submitting..." : currentStep === 2 ? "Complete Profile" : "Next"}
                    {!registering && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Registered Doctor - Show Only Doctor Portal Card */
          <div className="max-w-5xl mx-auto">
            {/* Doctor Portal View Card */}
            <Link href="/doctor-portal/home" className="block">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex flex-col">
                  {/* Header with Profile Picture and Wallet */}
                  <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                        My Portal
                      </h1>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const walletAddress = doctorData?.walletAddress || '0x1234567890abcdef1234567890abcdef12345678';
                          navigator.clipboard.writeText(walletAddress);
                          // You could add a toast notification here
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        title="Click to copy wallet address"
                      >
                        <span className="text-sm font-mono text-neutral-700 dark:text-neutral-300">
                          {(doctorData?.walletAddress || '0x1234567890abcdef1234567890abcdef12345678').slice(0, 6)}...
                          {(doctorData?.walletAddress || '0x1234567890abcdef1234567890abcdef12345678').slice(-4)}
                        </span>
                        <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-start gap-6">
                      {/* Profile Picture */}
                      <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 font-bold text-3xl flex-shrink-0 overflow-hidden">
                        {doctorData?.profilePicture ? (
                          <img src={doctorData.profilePicture} alt={doctorData.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{doctorData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR'}</span>
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                          {doctorData?.name || 'Dr. John Doe'}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                          License: {doctorData?.licenseNumber || 'MCI-123456'}
                        </p>
                        <div className="flex items-center gap-2">
                          {doctorData?.isAuthorized ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              Verified Doctor
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                              <AlertCircle className="w-4 h-4" />
                              Pending Verification
                            </div>
                          )}
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <div className="w-32 h-32 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <p className="text-xs text-center text-neutral-600 dark:text-neutral-400 mt-2">
                          Share Profile
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information - Horizontal Layout */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {/* Specialization */}
                      <div>
                        <dt className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                          Specialization
                        </dt>
                        <dd className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                          {doctorData?.specialization || 'Cardiologist'}
                        </dd>
                      </div>

                      {/* Qualification */}
                      <div>
                        <dt className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                          Qualification
                        </dt>
                        <dd className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                          {doctorData?.qualification || 'MBBS, MD'}
                        </dd>
                      </div>

                      {/* Experience */}
                      <div>
                        <dt className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                          Experience
                        </dt>
                        <dd className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                          {doctorData?.experience || '10+ years'}
                        </dd>
                      </div>

                      {/* Hospital */}
                      <div>
                        <dt className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                          Hospital
                        </dt>
                        <dd className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                          {doctorData?.hospital || 'City General Hospital'}
                        </dd>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <dt className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                        Location
                      </dt>
                      <dd className="text-sm text-neutral-700 dark:text-neutral-300">
                        {doctorData?.city || 'Mumbai'}, {doctorData?.state || 'Maharashtra'}
                      </dd>
                    </div>
                  </div>

                  {/* Portal Access - Footer Strip */}
                  <div className="bg-green-600 dark:bg-green-700 px-6 py-4">
                    <p className="text-sm text-white font-bold text-center">
                      Click to Access Doctor Portal →
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
