import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface CustomAIInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (customData: CustomHealthData) => void;
    currentData: {
        age: number;
        bloodGroup: string;
        bmi: number;
        allergies: string;
        chronicConditions: string;
        currentMedications: string;
    };
}

export interface CustomHealthData {
    age: number;
    bloodGroup: string;
    bmi: number;
    allergies: string;
    chronicConditions: string;
    currentMedications: string;
}

export default function CustomAIInputModal({ isOpen, onClose, onGenerate, currentData }: CustomAIInputModalProps) {
    const [formData, setFormData] = useState<CustomHealthData>(currentData);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-white" />
                            <h2 className="text-2xl font-bold text-white">Customize Health Data</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <p className="text-purple-100 mt-2 text-sm">
                        Modify the data below to generate personalized AI insights for different scenarios
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Age & Blood Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                Age (years)
                            </label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                                min="1"
                                max="120"
                                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                Blood Group
                            </label>
                            <select
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 transition"
                            >
                                <option value="">Select</option>
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

                    {/* BMI */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            BMI (Body Mass Index)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.bmi}
                            onChange={(e) => setFormData({ ...formData, bmi: parseFloat(e.target.value) || 0 })}
                            min="10"
                            max="60"
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="e.g., 22.5"
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Normal range: 18.5 - 24.9
                        </p>
                    </div>

                    {/* Allergies */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Allergies
                        </label>
                        <textarea
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 transition resize-none"
                            placeholder="e.g., Penicillin, Peanuts, Latex"
                        />
                    </div>

                    {/* Chronic Conditions */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Chronic Conditions
                        </label>
                        <textarea
                            value={formData.chronicConditions}
                            onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 transition resize-none"
                            placeholder="e.g., Diabetes, Hypertension, Asthma"
                        />
                    </div>

                    {/* Current Medications */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Current Medications
                        </label>
                        <textarea
                            value={formData.currentMedications}
                            onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-500 transition resize-none"
                            placeholder="e.g., Aspirin 100mg daily, Metformin 500mg twice daily"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setFormData(currentData)}
                            className="flex-1 px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition font-medium"
                        >
                            Reset to My Data
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            Generate Insights
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
