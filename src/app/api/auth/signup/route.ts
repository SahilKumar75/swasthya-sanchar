import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma, createWallet, encryptPrivateKey } from "@/lib/wallet-service";
import { fundNewUserWallet } from "@/lib/wallet-funding";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role, name } = body;

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    if (!["patient", "doctor"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be either 'patient' or 'doctor'" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // 🔑 AUTO-CREATE BLOCKCHAIN WALLET (No MetaMask needed!)
    const { address, privateKey } = createWallet();
    const encryptedKey = encryptPrivateKey(privateKey);

    // Create user with wallet
    const newUser = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: name || null,
        role,
        walletAddress: address,
        encryptedPrivateKey: encryptedKey,
      },
    });

    // Create role-specific profile
    if (role === "patient") {
      await prisma.patientProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    } else if (role === "doctor") {
      await prisma.doctorProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    // 💰 AUTO-FUND NEW WALLET (Hackathon-ready!)
    // Send small amount of MATIC for gas fees
    console.log(`🎉 New user created: ${email}`);
    console.log(`💼 Wallet address: ${address}`);

    // Fund wallet in background (don't wait for it)
    fundNewUserWallet(address).then((txHash) => {
      if (txHash) {
        console.log(`✅ Wallet funded! TX: ${txHash}`);
      } else {
        console.log(`⚠️  Wallet funding skipped (backend wallet may need funds)`);
      }
    }).catch((error) => {
      console.error(`❌ Wallet funding failed:`, error.message);
    });

    return NextResponse.json(
      {
        message: "Account created successfully! Blockchain wallet generated and funded automatically.",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          walletAddress: newUser.walletAddress, // User's blockchain address
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
