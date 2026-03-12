"use client";

import { useState, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import { forgotPasswordAPI } from "../../../lib/api";
import { AlertCircle, CheckCircle, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await forgotPasswordAPI(email);
      setSuccess("OTP sent to your email successfully!");
      // Store email for next step
      localStorage.setItem("resetEmail", email);
      
      // Redirect to OTP verification page after 2 seconds
      setTimeout(() => {
        router.push("/otp_check");
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
            <h1 className="text-4xl font-black tracking-tight text-blue-600">PRIMA.</h1>
            <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="Enter your email address"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-70 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-800/60 to-transparent backdrop-blur-[2px] flex flex-col justify-end p-20 text-white">
          <blockquote className="space-y-2">
            <p className="text-3xl font-medium">
              "Secure password recovery with PRIMA's advanced authentication system."
            </p>
            <footer className="text-lg opacity-80">— The Security Team</footer>
          </blockquote>
          
          <div className="mt-8 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-2">Password Recovery</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Secure OTP-based verification</li>
              <li>• Email-based password reset</li>
              <li>• Quick and easy process</li>
              <li>• Account security maintained</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}