import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

interface HealthInsightsRequest {
  age: number;
  gender: string;
  bloodGroup: string;
  bmi: number;
  bmiCategory: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  previousSurgeries?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: HealthInsightsRequest = await request.json();

    // Validate required fields
    if (!data.allergies || !data.chronicConditions || !data.currentMedications) {
      return NextResponse.json(
        { error: "Missing required medical data. Please complete your profile." },
        { status: 400 }
      );
    }

    // Check for Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please add GEMINI_API_KEY to environment variables." },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create personalized prompt
    const prompt = `You are a medical AI assistant providing personalized health advice.

Patient Profile:
- Age: ${data.age}, Gender: ${data.gender}
- Blood Group: ${data.bloodGroup}
- BMI: ${data.bmi} (${data.bmiCategory})
- Allergies: ${data.allergies}
- Chronic Conditions: ${data.chronicConditions}
- Current Medications: ${data.currentMedications}
${data.previousSurgeries ? `- Previous Surgeries: ${data.previousSurgeries}` : ''}

Generate 4 personalized health recommendations in JSON format:

{
  "conditionManagement": {
    "title": "Condition Management",
    "advice": "Specific advice for managing their chronic conditions (2-3 sentences)"
  },
  "medicationAdherence": {
    "title": "Medication Guidance",
    "advice": "Tips for their specific medications (2-3 sentences)"
  },
  "allergySafety": {
    "title": "Allergy Safety",
    "advice": "Important warnings based on their allergies (2-3 sentences)"
  },
  "lifestyleAdvice": {
    "title": "Lifestyle Tips",
    "advice": "Personalized lifestyle recommendations based on BMI and conditions (2-3 sentences)"
  }
}

Keep advice concise, actionable, and medically accurate. Focus on their specific conditions and medications.
IMPORTANT: Return ONLY the JSON object, no additional text.`;

    // Generate AI insights
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let insights;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      insights = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error generating health insights:", error);
    return NextResponse.json(
      { error: "Failed to generate health insights. Please try again later." },
      { status: 500 }
    );
  }
}
