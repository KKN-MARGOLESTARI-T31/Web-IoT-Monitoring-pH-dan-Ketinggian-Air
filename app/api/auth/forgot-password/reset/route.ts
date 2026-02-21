import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { resetToken, newPassword } = await request.json();

        if (!resetToken || !newPassword) {
            return NextResponse.json(
                { error: "Reset token dan password baru wajib diisi" },
                { status: 400 }
            );
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password minimal 6 karakter" },
                { status: 400 }
            );
        }

        // Find and verify reset token
        const token = await prisma.passwordResetToken.findUnique({
            where: { id: resetToken },
            include: { user: true },
        });

        if (!token) {
            return NextResponse.json(
                { error: "Token reset tidak valid" },
                { status: 400 }
            );
        }

        if (!token.isUsed) {
            return NextResponse.json(
                { error: "OTP belum diverifikasi" },
                { status: 400 }
            );
        }

        // Check if token is still valid (allow 15 minutes after verification)
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        if (token.createdAt < fifteenMinutesAgo) {
            return NextResponse.json(
                { error: "Token reset sudah kadaluarsa. Silakan minta OTP baru." },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await prisma.user.update({
            where: { id: token.userId },
            data: { password: hashedPassword },
        });

        // Delete all reset tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: { userId: token.userId },
        });

        console.log(
            `✅ Password reset successful for user: ${token.user.phone}`
        );

        return NextResponse.json({
            success: true,
            message: "Password berhasil diubah",
        });
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
