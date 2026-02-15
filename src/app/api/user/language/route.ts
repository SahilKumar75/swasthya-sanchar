/**
 * User Language Preference API
 * GET - Get user's preferred language
 * POST - Update user's preferred language
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

const VALID_LANGUAGES = ['en', 'hi', 'mr', 'bh'];

// GET - Get user's preferred language
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ language: 'en' }); // Default for unauthenticated users
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { preferredLanguage: true }
    });

    return NextResponse.json({ 
      language: user?.preferredLanguage || 'en' 
    });

  } catch (error) {
    console.error('Get language error:', error);
    return NextResponse.json({ language: 'en' });
  }
}

// POST - Update user's preferred language
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { language } = await req.json();

    if (!language || !VALID_LANGUAGES.includes(language)) {
      return NextResponse.json({ 
        error: "Invalid language. Must be one of: " + VALID_LANGUAGES.join(', ') 
      }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { preferredLanguage: language }
    });

    return NextResponse.json({ 
      success: true, 
      language,
      message: "Language preference updated"
    });

  } catch (error) {
    console.error('Update language error:', error);
    return NextResponse.json({ error: "Failed to update language" }, { status: 500 });
  }
}
