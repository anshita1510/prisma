import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="w-full pt-24 md:pt-32 pb-24 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url('https://plus.unsplash.com/premium_photo-1663931932651-ea743c9a0144?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Everything you need to
              <br />
              build a great company
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Tikr is your people enabler. From automation of people
              processes to creating an engaged and driven culture, Tikr
              is all you need to build a good to great company.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/login">
                <button className="bg-blue-600 text-white px-7 py-3 rounded-full font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Log in
                </button>
              </Link>

              <button className="group border border-gray-300 px-7 py-3 rounded-full font-medium hover:bg-gray-100 transition flex items-center gap-2">
                Take a tour
                <span className="transform group-hover:translate-x-1 transition">
                  →
                </span>
              </button>
            </div>

            {/* Ratings */}
            <div className="mt-12 flex gap-12">
              <div>
                <p className="font-semibold text-gray-900">⭐ 4.5</p>
                <p className="text-sm text-gray-600">rating on G2</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">⭐ 4.4</p>
                <p className="text-sm text-gray-600">rating on Capterra</p>
              </div>
            </div>
          </div>

          {/* RIGHT MOCK UI */}
          <div className="relative flex justify-center">
            <div className="grid grid-cols-2 gap-6 max-w-md">

              <div className="bg-white shadow-lg rounded-2xl p-5 hover:-translate-y-1 transition text-center">
                <p className="text-sm text-gray-500 mb-2">Automation</p>
                <img
                  src="https://plus.unsplash.com/premium_photo-1719930117885-0a0b2c65eb64?w=900"
                  alt=""
                  className="rounded-lg mb-3 h-24 w-full object-cover"
                />
                <p className="text-2xl font-bold text-gray-900">234</p>
              </div>

              <div className="bg-white shadow-lg rounded-2xl p-5 hover:-translate-y-1 transition">
                <p className="font-medium text-gray-900 mb-2">Analytics</p>
                <img
                  src="https://plus.unsplash.com/premium_photo-1721225464866-ff753501af7f?w=900"
                  alt=""
                  className="rounded-lg h-20 w-full object-cover mb-3"
                />
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-2xl p-6 col-span-2 hover:-translate-y-1 transition">
                <p className="font-medium mb-2">Payroll</p>
                <img
                  src="https://plus.unsplash.com/premium_photo-1681487729805-91f220c7da25?w=900"
                  alt=""
                  className="rounded-xl h-32 w-full object-cover"
                />
              </div>

              <div className="bg-white shadow-lg rounded-2xl p-5 text-center hover:-translate-y-1 transition">
                <p className="text-sm text-gray-500">Objectives</p>
                <p className="text-xl font-bold">$20M</p>
              </div>

              <div className="bg-white shadow-lg rounded-2xl p-5 text-center hover:-translate-y-1 transition">
                <p className="text-sm text-gray-500">Expense</p>
                <p className="text-xl font-bold">234</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
