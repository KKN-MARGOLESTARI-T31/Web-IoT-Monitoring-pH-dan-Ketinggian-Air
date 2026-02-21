import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { phone, otp } = await request.json();

        if (!phone || !otp) {
            return NextResponse.json(
                { error: "Nomor telepon dan OTP wajib diisi" },
                { status: 400 }
            );
        }

        // Find the most recent unused, unexpired OTP for this phone
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                phoneNumber: phone,
                isUsed: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: "OTP tidak valid atau sudah kadaluarsa" },
                { status: 400 }
            );
        }

        // Check if max attempts reached
        if (resetToken.attempts >= 5) {
            return NextResponse.json(
                { error: "Terlalu banyak percobaan. Silakan minta OTP baru." },
                { status: 429 }
            );
        }

        // Verify OTP
        if (resetToken.otpCode !== otp) {
            // Increment attempts
            await prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { attempts: resetToken.attempts + 1 },
            });

            const attemptsLeft = 5 - (resetToken.attempts + 1);
            return NextResponse.json(
                {
                    error: `OTP salah. Sisa percobaan: ${attemptsLeft}`,
                },
                { status: 400 }
            );
        }

        // OTP is valid - mark as used and return reset token
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { isUsed: true },
        });

        console.log(`✅ OTP verified successfully for phone: ${phone}`);

        // Return the reset token ID (will be used for password reset)
        return NextResponse.json({
            success: true,
            resetToken: resetToken.id,
            message: "OTP berhasil diverifikasi",
        });
    } catch (error: any) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
