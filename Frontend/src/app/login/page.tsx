"use client";

import React, { useState, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
  token: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "EMPLOYEE";
  userId: string;
}

export default function LoginPage(): JSX.Element {
  const router = useRouter();

  // 🔹 State
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // 🔹 Login handler
  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data: LoginResponse | { message?: string } = await res.json();

      if (!res.ok) {
        throw new Error(
          "message" in data ? data.message : "Login failed"
        );
      }

      const loginData = data as LoginResponse;

      // ✅ Store token securely (later: switch to httpOnly cookies)
      localStorage.setItem("token", loginData.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: loginData.userId,
          role: loginData.role,
        })
      );

      // 🔥 Role-based redirect
      switch (loginData.role) {
        case "SUPER_ADMIN":
          router.push("/dashboard_super");
          break;
        case "ADMIN":
          router.push("/dashboard_admin");
          break;
        default:
          router.push("/dashboard_user");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('https://plus.unsplash.com/premium_photo-1681488159219-e0f0f2542424?q=80&w=1974&auto=format&fit=crop')",
      }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tikr</h1>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800">
          Log in to your account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Welcome back! Please enter your details
        </p>

        {/* ❌ Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-3">
            {error}
          </p>
        )}

        {/* 🔹 Login Form */}
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
