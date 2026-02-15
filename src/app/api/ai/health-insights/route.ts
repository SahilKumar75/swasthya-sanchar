import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Groq from "groq-sdk";

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
    // Skip auth in dev mode
    if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH !== 'true') {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const data: HealthInsightsRequest = await request.json();

    // Validate required fields (allow empty strings, just check they exist)
    if (data.allergies === undefined || data.chronicConditions === undefined || data.currentMedications === undefined) {
      return NextResponse.json(
        { error: "Missing required medical data. Please complete your profile." },
        { status: 400 }
      );
    }

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please add GROQ_API_KEY to environment variables." },
        { status: 500 }
      );
    }

    // Initialize Groq AI
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Create personalized prompt
    const prompt = `You are a medical AI assistant providing personalized health advice.

Patient Profile:
- Age: ${data.age}, Gender: ${data.gender}
- Blood Group: ${data.bloodGroup}
- BMI: ${data.bmi} (${data.bmiCategory})
- Allergies: ${data.allergies || 'None'}
- Chronic Conditions: ${data.chronicConditions || 'None'}
- Current Medications: ${data.currentMedications || 'None'}
${data.previousSurgeries ? `- Previous Surgeries: ${data.previousSurgeries}` : ''}

Generate personalized health recommendations in JSON format with 4 DO's and 4 DON'Ts.
Each item should be ONE SHORT LINE (max 10-12 words).

{
  "dos": [
    "First do recommendation",
    "Second do recommendation",
    "Third do recommendation",
    "Fourth do recommendation"
  ],
  "donts": [
    "First don't recommendation",
    "Second don't recommendation",
    "Third don't recommendation",
    "Fourth don't recommendation"
  ]
}

Keep advice concise, actionable, and medically accurate. Focus on their specific conditions and medications.
IMPORTANT: Return ONLY the JSON object, no additional text.`;

    // Generate AI insights using Groq
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";

    // Parse JSON response
    let insights;
    try {
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

  } catch (error: any) {
    console.error("Error generating health insights:", error);
    console.error("Error details:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack?.substring(0, 500)
    });
    
    // Return more specific error message
    const errorMessage = error?.message?.includes('API key') 
      ? "AI service authentication failed. Please check GROQ_API_KEY."
      : error?.message?.includes('rate limit')
      ? "AI service rate limited. Please try again in a few seconds."
      : error?.message || "Failed to generate health insights. Please try again later.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
