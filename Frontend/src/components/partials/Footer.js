import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Tikr</h3>
            <p className="text-sm leading-relaxed">
              Your people enabler. From automation of people processes to creating
              an engaged and driven culture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="transition hover:text-white">Home</Link></li>
              <li><Link href="/features" className="transition hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="transition hover:text-white">Pricing</Link></li>
              <li><Link href="/about" className="transition hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="transition hover:text-white">Blog</a></li>
              <li><a href="#" className="transition hover:text-white">Case Studies</a></li>
              <li><a href="#" className="transition hover:text-white">Help Center</a></li>
              <li><a href="#" className="transition hover:text-white">API Docs</a></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition hover:text-white">Terms of Service</Link></li>
              <li><a href="#" className="transition hover:text-white">Cookie Policy</a></li>
            </ul>

            <div className="mt-8 flex gap-4 text-sm">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">Facebook</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-800 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Tikr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
