"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Komponen inti yang menggunakan useSearchParams() —
// harus dipisah agar bisa dibungkus <Suspense>
function VerifyOTPForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "";
    const expiryParam = searchParams.get("expiry");

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [canResend, setCanResend] = useState(false);

    // Initialize timer from URL param
    useEffect(() => {
        if (expiryParam) {
            const expiryTime = parseInt(expiryParam, 10);
            const now = Date.now();
            const diff = Math.floor((expiryTime - now) / 1000);

            if (diff > 0) {
                setTimeLeft(diff);
            } else {
                setTimeLeft(0);
            }
        } else {
            // Fallback if no expiry param
            setTimeLeft(300);
        }
    }, [expiryParam]);

    // Countdown timer logic
    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        if (timeLeft < 240) {
            setCanResend(true);
        } else {
            setCanResend(false);
        }

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "OTP tidak valid");
                setIsLoading(false);
                return;
            }

            // Success - redirect to reset password page with token
            router.push(`/forgot-password/reset?token=${data.resetToken}`);
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("OTP baru telah dikirim!");
                const expiresIn = data.expiresIn || 300;
                const newExpiry = Date.now() + expiresIn * 1000;
                router.replace(`/forgot-password/verify-otp?phone=${encodeURIComponent(phone)}&expiry=${newExpiry}`);
                setTimeLeft(expiresIn);
                setCanResend(false);
            } else {
                setError(data.error || "Gagal mengirim ulang OTP");
            }
        } catch (error) {
            setError("Gagal mengirim ulang OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <Link
                    href="/forgot-password"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </Link>

                <h1 className="text-2xl font-bold text-center mb-2">
                    Verifikasi OTP
                </h1>
                <p className="text-gray-400 text-center text-sm mb-2">
                    Masukkan 6 digit kode OTP yang dikirim ke
                </p>
                <p className="text-gray-700 text-center text-sm font-semibold mb-8">
                    {phone}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            Kode OTP
                        </label>
                        <input
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            className="w-full p-4 mt-1 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl font-mono tracking-widest"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            required
                            disabled={isLoading || timeLeft === 0}
                        />
                    </div>

                    <div className="text-center h-6">
                        {timeLeft > 0 ? (
                            <p className="text-sm text-gray-600">
                                Kode berlaku: <span className="font-semibold">{formatTime(timeLeft)}</span>
                            </p>
                        ) : (
                            expiryParam && (
                                <p className="text-sm text-red-600 font-semibold">
                                    OTP sudah kadaluarsa
                                </p>
                            )
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || timeLeft === 0 || otp.length !== 6}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
                    </button>

                    {canResend && (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isLoading}
                            className="w-full py-3 text-blue-600 font-semibold hover:underline disabled:opacity-50"
                        >
                            Kirim Ulang OTP
                        </button>
                    )}
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    Tidak menerima kode? Cek console server atau hubungi admin
                </p>
            </div>
        </div>
    );
}

// Halaman utama — membungkus komponen dengan <Suspense>
// agar useSearchParams() tidak menyebabkan error saat prerendering
export default function VerifyOTPPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500">Memuat halaman...</p>
                </div>
            }
        >
            <VerifyOTPForm />
        </Suspense>
    );
}
