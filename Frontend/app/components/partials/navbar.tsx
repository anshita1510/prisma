"use client";

import { useState } from "react";
import Link from "next/link";
import { Target } from "lucide-react";

// 1. Added this interface to define the types for your props
interface MenuItemProps {
  label: string;
  items: string[];
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // 2. Added <string | null> so TypeScript knows this state stores the label name
  const [dropdown, setDropdown] = useState<string | null>(null);

  // 3. Added the types to the function parameters here
  const MenuItem = ({ label, items }: MenuItemProps) => (
    <div
      className="relative"
      onMouseEnter={() => setDropdown(label)}
      onMouseLeave={() => setDropdown(null)}
    >
      <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
        {label}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {dropdown === label && (
        <div className="absolute left-0 mt-3 w-48 rounded-xl border bg-white shadow-lg">
          {/* 4. Added : string to the map parameter */}
          {items.map((item: string) => (
            <Link
              key={item}
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="fixed z-50 mt-4 w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-blue-700 rounded-xl flex items-center justify-center shadow-lg font-bold border-2 border-blue-600">
              <Target size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight uppercase text-gray-800">Tikr</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <MenuItem label="Products" items={["HRMS", "Payroll", "Analytics"]} />
            <MenuItem label="Customers" items={["Startups", "SMEs", "Enterprises"]} />
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/resources" className="text-gray-700 hover:text-gray-900">
              Resources
            </Link>
            <Link href="/careers" className="text-gray-700 hover:text-gray-900">
              Careers
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <button className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
              Get free trial
            </button>
          </div>

          {/* Mobile Button */}
          <button
            className="text-gray-700 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute left-0 top-16 w-full space-y-4 bg-white px-6 py-4 shadow-lg md:hidden">
          <details>
            <summary className="cursor-pointer text-gray-700">Products</summary>
            <div className="ml-4 mt-2 space-y-2 text-sm text-gray-600">
              <p>HRMS</p>
              <p>Payroll</p>
              <p>Analytics</p>
            </div>
          </details>

          <details>
            <summary className="cursor-pointer text-gray-700">Customers</summary>
            <div className="ml-4 mt-2 space-y-2 text-sm text-gray-600">
              <p>Startups</p>
              <p>SMEs</p>
              <p>Enterprises</p>
            </div>
          </details>

          <Link href="/pricing" className="block text-gray-700">
            Pricing
          </Link>
          <Link href="/about" className="block text-gray-700">
            About
          </Link>
          <Link href="/resources" className="block text-gray-700">
            Resources
          </Link>
          <Link href="/careers" className="block text-gray-700">
            Careers
          </Link>

          <div className="space-y-2 pt-2">
            <Link href="/login" className="block text-gray-700">
              Login
            </Link>
            <button className="w-full rounded-full bg-blue-600 py-2 text-white">
              Get free trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}