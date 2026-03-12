"use client"
import React from "react";
import Link from "next/link";
import { BarChart3, Zap, DollarSign, Target, TrendingUp } from "lucide-react";
import ParticleBackground from "../ParticleBackground";

export default function HeroSection() {
  return (
    <section className="w-full pt-24 md:pt-32 pb-24 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-purple-50/30 z-[2]"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20 z-[3]">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="relative z-20">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight drop-shadow-sm">
              Everything you need to
              <br />
              build a great company
            </h1>

            <p className="mt-6 text-lg text-gray-700 max-w-xl drop-shadow-sm">
              PRIMA is your people enabler. From automation of people
              processes to creating an engaged and driven culture, PRIMA
              is all you need to build a good to great company.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/login">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm">
                  Log in
                </button>
              </Link>

              <button className="group border border-gray-300/80 px-7 py-3 rounded-full font-medium hover:bg-white/90 hover:border-blue-300 transition-all duration-300 flex items-center gap-2 backdrop-blur-md bg-white/60 shadow-lg">
                Take a tour
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </button>
            </div>

            {/* Ratings */}
            <div className="mt-12 flex gap-12">
              <div className="backdrop-blur-md bg-white/50 rounded-2xl p-4 border border-white/30 shadow-lg">
                <p className="font-semibold text-gray-900">⭐ 4.5</p>
                <p className="text-sm text-gray-600">rating on G2</p>
              </div>
              <div className="backdrop-blur-md bg-white/50 rounded-2xl p-4 border border-white/30 shadow-lg">
                <p className="font-semibold text-gray-900">⭐ 4.4</p>
                <p className="text-sm text-gray-600">rating on Capterra</p>
              </div>
            </div>
          </div>

          {/* RIGHT FLOATING BUBBLES */}
          <div className="relative flex justify-center min-h-[500px] z-20">
            
            {/* Automation Bubble */}
            <div className="absolute top-0 left-8 animate-bounce [animation-duration:6s] [animation-delay:0s]">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative backdrop-blur-lg bg-gradient-to-br from-white/60 to-white/20 border border-white/40 rounded-3xl p-6 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 w-48">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-8 h-8 text-blue-600 drop-shadow-sm" />
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">Automation</p>
                  <div className="h-16 bg-gradient-to-br from-blue-100/60 to-cyan-100/60 rounded-2xl mb-3 flex items-center justify-center backdrop-blur-sm">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">234</p>
                </div>
              </div>
            </div>

            {/* Analytics Bubble */}
            <div className="absolute top-16 right-4 animate-bounce [animation-duration:8s] [animation-delay:1s]">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative backdrop-blur-lg bg-gradient-to-br from-white/60 to-white/20 border border-white/40 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 w-44">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600 drop-shadow-sm" />
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">Analytics</p>
                  <div className="h-12 bg-gradient-to-br from-purple-100/60 to-pink-100/60 rounded-2xl mb-3 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-6 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full shadow-sm"></div>
                      <div className="w-2 h-8 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full shadow-sm"></div>
                      <div className="w-2 h-4 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payroll Bubble - Larger */}
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 animate-bounce [animation-duration:10s] [animation-delay:2s]">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-teal-400/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative backdrop-blur-lg bg-gradient-to-br from-white/60 to-white/20 border border-white/40 rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 w-56">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-10 h-10 text-emerald-600 drop-shadow-sm" />
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 font-medium">Payroll</p>
                  <div className="h-20 bg-gradient-to-br from-emerald-100/60 to-teal-100/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xs text-emerald-600 font-medium">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives Bubble */}
            <div className="absolute bottom-16 left-12 animate-bounce [animation-duration:7s] [animation-delay:0.5s]">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/40 to-red-400/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative backdrop-blur-lg bg-gradient-to-br from-white/60 to-white/20 border border-white/40 rounded-3xl p-6 shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 w-40">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-orange-600 drop-shadow-sm" />
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">Objectives</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">$20M</p>
                </div>
              </div>
            </div>

            {/* Expense Bubble */}
            <div className="absolute bottom-8 right-8 animate-bounce [animation-duration:9s] [animation-delay:1.5s]">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/40 to-rose-400/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative backdrop-blur-lg bg-gradient-to-br from-white/60 to-white/20 border border-white/40 rounded-3xl p-6 shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 w-40">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-pink-600 drop-shadow-sm" />
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50"></div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">Expense</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-sm">234</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}