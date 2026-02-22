"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";

// Komponen inti yang menggunakan useSearchParams() —
// harus dipisah agar bisa dibungkus <Suspense>
function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Password dan konfirmasi password tidak cocok");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetToken, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Gagal mengubah password");
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Berhasil!</h1>
                    <p className="text-gray-600 mb-6">
                        Password Anda telah berhasil diubah.
                    </p>
                    <p className="text-sm text-gray-500">
                        Mengalihkan ke halaman login...
                    </p>
                </div>
            </div>
        );
    }

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

                <h1 className="text-2xl font-bold text-center mb-2">
                    Buat Password Baru
                </h1>
                <p className="text-gray-400 text-center text-sm mb-8">
                    Masukkan password baru Anda
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <PasswordInput
                        id="newPassword"
                        label="Password Baru"
                        placeholder="Min. 6 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                    />

                    <PasswordInput
                        id="confirmPassword"
                        label="Konfirmasi Password"
                        placeholder="Ulangi password baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                    />

                    {/* Password strength indicator */}
                    {newPassword && (
                        <div className="text-xs">
                            <p className="text-gray-600 mb-1">Kekuatan password:</p>
                            <div className="flex gap-1">
                                <div
                                    className={`h-1 flex-1 rounded ${newPassword.length >= 6 ? "bg-green-500" : "bg-gray-200"}`}
                                />
                                <div
                                    className={`h-1 flex-1 rounded ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-200"}`}
                                />
                                <div
                                    className={`h-1 flex-1 rounded ${newPassword.length >= 10 ? "bg-green-500" : "bg-gray-200"}`}
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !newPassword || !confirmPassword}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Menyimpan..." : "Ubah Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Halaman utama — membungkus komponen dengan <Suspense>
// agar useSearchParams() tidak menyebabkan error saat prerendering
export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500">Memuat halaman...</p>
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
