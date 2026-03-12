"use client";

import { useState } from "react";
import Link from "next/link";
import { Target } from "lucide-react";

interface MenuItemProps {
  label: string;
  items: string[];
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/login?logout=true&t=" + Date.now();
  };

  const MenuItem = ({ label, items }: MenuItemProps) => (
    <div
      className="relative"
      onMouseEnter={() => setDropdown(label)}
      onMouseLeave={() => setDropdown(null)}
    >
      <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
        {label}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdown === label && (
        // pt-6 creates an invisible bridge so the mouse doesn't leave the div
        // when moving from the button down to the dropdown items
        <div className="absolute left-0 top-full w-48 pt-6">
          <div className="rounded-xl border bg-white shadow-lg">
            {items.map((item: string) => (
              <Link
                key={item}
                href={`/${label.toLowerCase()}/${item.toLowerCase()}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {item}
              </Link>
            ))}
          </div>
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
            <span className="font-bold text-lg tracking-tight uppercase text-gray-800">PRIMA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <MenuItem label="Products" items={["HRMS", "Payroll", "Analytics"]} />
            <MenuItem label="Customers" items={["Startups", "SMEs", "Enterprises"]} />
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">Pricing</Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link href="/resources" className="text-gray-700 hover:text-gray-900">Resources</Link>
            <Link href="/careers" className="text-gray-700 hover:text-gray-900">Careers</Link>
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="/login?logout=true"
              onClick={handleLoginClick}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              Login
            </a>
            <a
              href="https://www.PRIMA.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 inline-block text-center"
            >
              Get free trial
            </a>
          </div>

          {/* Mobile Button */}
          <button className="text-gray-700 md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
              <Link href="/products/hrms" className="block hover:text-blue-600">HRMS</Link>
              <Link href="/products/payroll" className="block hover:text-blue-600">Payroll</Link>
              <Link href="/products/analytics" className="block hover:text-blue-600">Analytics</Link>
            </div>
          </details>
          <details>
            <summary className="cursor-pointer text-gray-700">Customers</summary>
            <div className="ml-4 mt-2 space-y-2 text-sm text-gray-600">
              <Link href="/customers/startups" className="block hover:text-blue-600">Startups</Link>
              <Link href="/customers/smes" className="block hover:text-blue-600">SMEs</Link>
              <Link href="/customers/enterprises" className="block hover:text-blue-600">Enterprises</Link>
            </div>
          </details>
          <Link href="/pricing" className="block text-gray-700">Pricing</Link>
          <Link href="/about" className="block text-gray-700">About</Link>
          <Link href="/resources" className="block text-gray-700">Resources</Link>
          <Link href="/careers" className="block text-gray-700">Careers</Link>
          <div className="space-y-2 pt-2">
            <a href="/login?logout=true" onClick={handleLoginClick} className="block text-gray-700 cursor-pointer">
              Login
            </a>
            <a
              href="https://www.PRIMA.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-blue-600 py-2 text-white inline-block text-center"
            >
              Get free trial
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}