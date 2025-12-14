const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            // Testing Session Pooler (5432) - This is what Vercel uses
            url: "postgresql://postgres.nmmkqibbckhwnhjophpn:rygTyk-nidsi9-bezhav@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
        }
    }
});

async function main() {
    console.log("Testing SESSION POOLER (5432) connection...");
    try {
        await prisma.$connect();
        console.log("✅ Successfully connected to the database (Session Pooler)!");
        const userCount = await prisma.user.count();
        console.log(`✅ Database query successful. Found ${userCount} users.`);
    } catch (e) {
        console.error("❌ Connection failed:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
