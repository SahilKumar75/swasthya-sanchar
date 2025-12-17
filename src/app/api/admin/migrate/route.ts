import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/wallet-service";

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

        console.log("🔄 Running database migration...");

        // Execute the migration SQL directly
        const migrationSQL = `
      -- Add missing columns to PatientProfile if they don't exist
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='PatientProfile' AND column_name='fullName') THEN
          ALTER TABLE "PatientProfile" ADD COLUMN "fullName" TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='PatientProfile' AND column_name='profilePicture') THEN
          ALTER TABLE "PatientProfile" ADD COLUMN "profilePicture" TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='PatientProfile' AND column_name='streetAddress') THEN
          ALTER TABLE "PatientProfile" ADD COLUMN "streetAddress" TEXT;
        END IF;
      END $$;
    `;

        await prisma.$executeRawUnsafe(migrationSQL);

        console.log("✅ Migration completed successfully!");

        return NextResponse.json({
            success: true,
            message: "Database schema updated successfully"
        });
    } catch (error: any) {
        console.error("❌ Migration failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            { status: 500 }
        );
    }
}
