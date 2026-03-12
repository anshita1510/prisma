
"use client"
import React from "react";
import { useRouter } from 'next/navigation';
export default function LoginPage(){
  const router = useRouter();
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('https://plus.unsplash.com/premium_photo-1681488159219-e0f0f2542424?q=80&w=1974&auto=format&fit=crop')",
      }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        {/* Logo / Brand */}
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">PRIMA</h1>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Create your user 
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Welcome back! Please enter your details
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First
            </label>
            <input
              type="name"
              placeholder="First-name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
             Last
            </label>
            <input
              type="name"
              placeholder="Last-name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll
            </label>
            <input
              type="name"
              placeholder="admin/user"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="name"
              placeholder="Devloper"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-full font-medium hover:bg-blue-700 transition"
          >
           Create
          </button>
       
        </form>


      

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          have a good day 
      
        </p>
      </div>
    </div>
  );
}
