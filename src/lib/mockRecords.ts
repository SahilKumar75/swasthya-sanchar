export interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  diagnosis: string;
  prescription: string;
  doctor: string;
  notes: string;
}

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "REC-001",
    date: "2024-12-01",
    type: "General Checkup",
    diagnosis: "Healthy",
    prescription: "Vitamin D supplements",
    doctor: "Dr. Sarah Johnson",
    notes: "Annual checkup completed. All vital signs normal."
  },
  {
    id: "REC-002",
    date: "2024-11-15",
    type: "Follow-up",
    diagnosis: "Seasonal Allergies",
    prescription: "Antihistamine - Cetirizine 10mg daily",
    doctor: "Dr. Michael Chen",
    notes: "Patient responding well to treatment. Continue for 2 more weeks."
  },
  {
    id: "REC-003",
    date: "2024-10-20",
    type: "Emergency Visit",
    diagnosis: "Sprained Ankle",
    prescription: "Ibuprofen 400mg as needed, RICE protocol",
    doctor: "Dr. Emily Rodriguez",
    notes: "Minor sprain. Expected recovery in 2-3 weeks with rest."
  }
];

export interface EmergencyProfile {
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalConditions: string[];
  currentMedications: string[];
}

export const mockEmergencyProfile: EmergencyProfile = {
  bloodGroup: "O+",
  allergies: ["Penicillin", "Peanuts"],
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+1 (555) 123-4567"
  },
  medicalConditions: ["Hypertension"],
  currentMedications: ["Lisinopril 10mg daily"]
};
