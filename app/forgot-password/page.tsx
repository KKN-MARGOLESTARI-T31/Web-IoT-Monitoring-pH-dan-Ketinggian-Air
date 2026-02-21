"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Gagal mengirim OTP");
                setIsLoading(false);
                return;
            }

            // Calculate expiry time
            const expiresIn = data.expiresIn || 300; // default 5 minutes
            const expiryTime = Date.now() + expiresIn * 1000;

            // Success - redirect to verify OTP page with expiry time
            router.push(
                `/forgot-password/verify-otp?phone=${encodeURIComponent(
                    phone
                )}&expiry=${expiryTime}`
            );
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Login
                </Link>

                <h1 className="text-2xl font-bold text-center mb-2">Lupa Password</h1>
                <p className="text-gray-400 text-center text-sm mb-8">
                    Masukkan nomor telepon Anda untuk menerima kode OTP
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            Nomor Telepon
                        </label>
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="0812xxxx"
                                className="w-full p-3 pl-11 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Mengirim..." : "Kirim OTP"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Kode OTP akan dikirim ke nomor WhatsApp Anda
                </p>
            </div>
        </div>
    );
}
