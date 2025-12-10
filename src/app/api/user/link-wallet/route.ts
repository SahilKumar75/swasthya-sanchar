import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get wallet address from request body
    const { walletAddress } = await request.json();
    
    if (!walletAddress || !walletAddress.startsWith("0x")) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    // Check if wallet is already linked to another user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].email !== session.user.email) {
      return NextResponse.json(
        { error: "This wallet is already linked to another account" },
        { status: 409 }
      );
    }

    // Update user's wallet address
    await db
      .update(users)
      .set({
        walletAddress: walletAddress,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email));

    return NextResponse.json({
      success: true,
      message: "Wallet linked successfully",
      walletAddress,
    });
  } catch (error) {
    console.error("Error linking wallet:", error);
    return NextResponse.json(
      { error: "Failed to link wallet" },
      { status: 500 }
    );
  }
}
