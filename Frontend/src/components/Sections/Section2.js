"use client"
import React, { useState } from "react";

const CARDS = {
  payroll: {
    title: "Payroll",
    subtitle: "We redefined Payroll industry back in 2016. 6 simple steps. No manual tasks. All on cloud.",
    color: "bg-blue-100 text-blue-600",
    content: {
      heading: "Payroll & Expense Management",
      description:
        "Automate salaries, deductions, reimbursements, payslips and stay 100% compliant with statutory rules.",
      points: [
        "Automated salary processing",
        "Tax & compliance ready",
        "Expense reimbursements",
        "Payslip generation"
      ]
    }
  },
  modernHR: {
    title: "Modern HR",
    subtitle:
      "All your people information in one place to create a connected digital workplace.",
    color: "bg-green-100 text-green-600",
    content: {
      heading: "Modern HR Management",
      description:
        "Centralize employee data, documents, roles and lifecycle in a single system.",
      points: [
        "Employee profiles",
        "Document management",
        "Org structure",
        "HR workflows"
      ]
    }
  },
  performance: {
    title: "Performance",
    subtitle:
      "Build a high-performing culture driven by contextual feedback and goal alignment.",
    color: "bg-pink-100 text-pink-600",
    content: {
      heading: "Performance & Culture",
      description:
        "Drive growth with goals, reviews and continuous feedback.",
      points: [
        "OKRs & goals",
        "Performance reviews",
        "Continuous feedback",
        "Culture building"
      ]
    }
  }
};

export default function OurWorkSection() {
  const [active, setActive] = useState("payroll");
  const current = CARDS[active];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Performance-driven HR platform
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to build, manage and grow a modern workforce.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {Object.entries(CARDS).map(([key, card]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`text-left bg-white p-8 rounded-2xl shadow-sm border transition hover:shadow-md \
                ${active === key ? "border-blue-500" : "border-transparent"}`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 ${card.color}`}
              >
                ◎
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.subtitle}</p>
              <span className="text-blue-600 font-medium">Learn more →</span>
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">
            {current.content.heading}
          </h3>
          <p className="text-gray-600 mb-6">
            {current.content.description}
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {current.content.points.map((point, index) => (
              <li
                key={index}
                className="bg-gray-50 p-4 rounded-xl text-gray-700"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
