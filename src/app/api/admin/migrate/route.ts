import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// This endpoint should be protected in production!
// Only use for manual schema migrations
export async function POST(req: NextRequest) {
    try {
        // Add a simple auth check (you should use a secret token)
        const authHeader = req.headers.get("authorization");
        const expectedToken = process.env.MIGRATION_SECRET || "change-me-in-production";

        if (authHeader !== `Bearer ${expectedToken}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("🔄 Running Prisma DB Push...");

        const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss");

        console.log("✅ Prisma DB Push completed!");
        console.log("STDOUT:", stdout);
        if (stderr) console.log("STDERR:", stderr);

        return NextResponse.json({
            success: true,
            message: "Database schema updated successfully",
            output: stdout,
            errors: stderr || null
        });
    } catch (error: any) {
        console.error("❌ Prisma DB Push failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                output: error.stdout || null,
                errors: error.stderr || null
            },
            { status: 500 }
        );
    }
}
