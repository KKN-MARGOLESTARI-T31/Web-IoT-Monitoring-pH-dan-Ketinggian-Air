import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate random 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json(
                { error: "Nomor telepon wajib diisi" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { phone },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Nomor telepon tidak terdaftar" },
                { status: 404 }
            );
        }

        // Check rate limiting: max 3 requests per hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentRequests = await prisma.passwordResetToken.count({
            where: {
                phoneNumber: phone,
                createdAt: {
                    gte: oneHourAgo,
                },
            },
        });

        if (recentRequests >= 3) {
            return NextResponse.json(
                { error: "Terlalu banyak permintaan. Silakan coba lagi dalam 1 jam." },
                { status: 429 }
            );
        }

        // Generate OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to database
        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                phoneNumber: phone,
                otpCode,
                expiresAt,
            },
        });

        // Log OTP to console (for development - in production, send via WhatsApp)
        console.log("\n" + "=".repeat(50));
        console.log("🔐 PASSWORD RESET OTP");
        console.log("=".repeat(50));
        console.log(`Phone: ${phone}`);
        console.log(`OTP Code: ${otpCode}`);
        console.log(`Expires: ${expiresAt.toLocaleTimeString("id-ID")}`);
        console.log("=".repeat(50) + "\n");

        // Send OTP via WhatsApp using FONNTE API
        if (process.env.FONNTE_API_KEY) {
            try {
                const response = await fetch('https://api.fonnte.com/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': process.env.FONNTE_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        target: phone,
                        message: `🔐 Kode OTP TEGASU Anda: *${otpCode}*\n\nKode berlaku 5 menit.\nJangan bagikan kode ini ke siapapun.`,
                        countryCode: '62'
                    })
                });
                const result = await response.json();
                console.log(`✅ OTP sent via WhatsApp to ${phone}. Response:`, result);
            } catch (error) {
                console.error("❌ Error sending WhatsApp message:", error);
                // Don't fail the request if WhatsApp fails, just log it
                // The OTP is still in the console/database
            }
        } else {
            console.warn("⚠️ FONNTE_API_KEY not found in env. WhatsApp message not sent.");
        }

        return NextResponse.json({
            success: true,
            message: "OTP telah dikirim. Silakan cek console server.",
            expiresIn: 300, // 5 minutes in seconds
        });
    } catch (error: any) {
        console.error("Error requesting OTP:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
