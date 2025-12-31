"use client"
import React, { useState } from "react";

const FEATURES = {
  people: {
    title: "People Data & Analytics",
    description:
      "Connect all your people data in one place and gain powerful insights for better decisions.",
    preview: {
      name: "People Analytics",
      role: "Insights Dashboard",
      about:
        "Visualize employee data, trends, and reports to make smarter HR decisions."
    }
  },
  payroll: {
    title: "Payroll & Expense Tracking",
    description:
      "Automate payroll and expenses with complete accuracy and compliance.",
    preview: {
      name: "Payroll System",
      role: "Salary & Expenses",
      about:
        "Manage salaries, deductions, reimbursements, and payslips with full compliance."
    }
  },
  performance: {
    title: "Performance & Culture",
    description:
      "Set goals, track performance, and build a strong company culture.",
    preview: {
      name: "Performance",
      role: "Goals & Reviews",
      about:
        "Track OKRs, reviews, and continuous feedback to improve team performance."
    }
  },
  hiring: {
    title: "Hiring & Onboarding",
    description:
      "Hire faster and onboard employees with personalized workflows.",
    preview: {
      name: "Hiring",
      role: "Recruitment",
      about:
        "Streamline hiring, offers, and onboarding journeys for new employees."
    }
  }
};

export default function OurWorkSection() {
  const [active, setActive] = useState("people");
  const current = FEATURES[active];

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart HR to outsmart the changing world
          </h1>
          <p className="text-gray-600 text-lg">
            The world has changed and it will keep changing. Our HR platform
            helps organizations adapt, evolve, and scale by working smarter and
            making data-driven decisions.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Features (Clickable) */}
          <div className="space-y-6">
            {Object.entries(FEATURES).map(([key, feature]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full text-left p-6 rounded-2xl transition shadow-sm border \
                  ${
                    active === key
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-transparent hover:border-gray-200"
                  }`}
              >
                <h3
                  className={`font-semibold text-lg mb-2 \
                    ${active === key ? "text-blue-600" : "text-gray-900"}`}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </button>
            ))}
          </div>

          {/* Right Dynamic Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-200" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {current.preview.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {current.preview.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Module</p>
                <p className="font-semibold">{current.title}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-semibold">Active</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <h5 className="font-semibold mb-2">Overview</h5>
              <p className="text-sm text-gray-600">
                {current.preview.about}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
