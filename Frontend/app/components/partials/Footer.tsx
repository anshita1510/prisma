import Link from "next/link";
import { Target, Mail, Phone, MapPin, X, Linkedin, Facebook, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 md:grid-cols-2">
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg font-bold">
                  <Target size={18} />
                </div>
                <span className="font-bold text-xl text-white tracking-tight uppercase">Prima</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4 max-w-md text-sm">
                Enterprise HR Management System designed to streamline HR operations, 
                attendance tracking, leave management, and project workflows.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Mail size={14} className="text-blue-400" />
                  <span>support@prima-hr.com</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone size={14} className="text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin size={14} className="text-blue-400" />
                  <span>Seasia Infotech, Mohali, Punjab</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">Home</Link></li>
                <li><Link href="/features" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">Features</Link></li>
                <li><Link href="/pricing" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">Pricing</Link></li>
                <li><Link href="/about" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link href="/contact" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">Contact</Link></li>
              </ul>
            </div>

            {/* Resources & Support */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">Blog</Link></li>
                <li><Link href="/help" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">Help Center</Link></li>
                <li><Link href="/api-docs" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">API Docs</Link></li>
                <li><Link href="/downloads" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">Downloads</Link></li>
                <li><Link href="/status" className="transition hover:text-blue-400 hover:translate-x-1 inline-block">Status</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800"></div>

        {/* Bottom Section */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" className="transition hover:text-blue-400">Privacy</Link>
              <Link href="/terms" className="transition hover:text-blue-400">Terms</Link>
              <Link href="/cookies" className="transition hover:text-blue-400">Cookies</Link>
              <Link href="/security" className="transition hover:text-blue-400">Security</Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com/prima-hr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center transition hover:bg-blue-600 hover:scale-110"
              >
                <X size={16} />
              </a>
              <a 
                href="https://linkedin.com/company/prima-hr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center transition hover:bg-blue-600 hover:scale-110"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://facebook.com/prima-hr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center transition hover:bg-blue-600 hover:scale-110"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://github.com/prima-hr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center transition hover:bg-blue-600 hover:scale-110"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Prima HR Management System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
