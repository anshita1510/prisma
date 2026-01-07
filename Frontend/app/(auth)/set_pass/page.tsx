"use client";

import { useState, FormEvent, JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAPI } from "../../../lib/api";

export default function SetPasswordPage(): JSX.Element {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    // Check if user came from OTP verification
    const resetEmail = localStorage.getItem("resetEmail");
    if (!resetEmail) {
      // If no email found, redirect to forgot password
      router.push("/Forget_pass");
    }
  }, [router]);

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await resetPasswordAPI(newPassword, confirmPassword);
      setSuccess("Password reset successfully!");
      
      // Clear stored email
      localStorage.removeItem("resetEmail");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* --- Left Half: The Form --- */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:w-1/2 xl:w-[40%]">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight text-green-600">Tikr.</h1>
            <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Set New Password
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Create a new password for your account.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleResetPassword}>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">New Password</label>
              </div>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* --- Right Half: Visual/Interactive Panel --- */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070"
          alt="Office Background"
        />
        <div className="absolute inset-0 bg-green-900/40 backdrop-blur-[2px] flex flex-col justify-end p-20 text-white">
          <blockquote className="space-y-2">
            <p className="text-3xl font-medium">
              "Tikr has completely transformed how our team tracks productivity and stays organized."
            </p>
            <footer className="text-lg opacity-80">— The Management Team</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}