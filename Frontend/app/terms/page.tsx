import Link from "next/link";
import { ArrowLeft, FileText, Scale, AlertTriangle, Users, Shield, Clock } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Terms of Service</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of PRIMA HR Management System. Please read them carefully 
            before using our services.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content Sections */}
        <div className="prose prose-lg max-w-none">
          
          {/* Acceptance of Terms */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Acceptance of Terms</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <p className="text-gray-700 mb-4">
                By accessing and using PRIMA HR Management System ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Service Description</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <p className="text-gray-700 mb-6">
                PRIMA is a comprehensive HR management platform that provides:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Features</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Employee management and onboarding</li>
                    <li>• Attendance tracking and time management</li>
                    <li>• Leave management and approval workflows</li>
                    <li>• Project and task management</li>
                    <li>• Performance evaluation and reviews</li>
                    <li>• Analytics and reporting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Services</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Role-based access control</li>
                    <li>• Multi-tenant organization support</li>
                    <li>• Real-time notifications</li>
                    <li>• Calendar and event management</li>
                    <li>• Document management</li>
                    <li>• API integrations</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">User Responsibilities</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Security</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Maintain the confidentiality of your login credentials</li>
                    <li>• Use strong passwords and enable two-factor authentication when available</li>
                    <li>• Immediately notify us of any unauthorized access to your account</li>
                    <li>• Log out from shared or public computers</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Acceptable Use</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Use the service only for legitimate business purposes</li>
                    <li>• Comply with all applicable laws and regulations</li>
                    <li>• Respect the privacy and rights of other users</li>
                    <li>• Do not attempt to gain unauthorized access to any part of the service</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• Uploading malicious software or harmful content</li>
                      <li>• Attempting to reverse engineer or hack the system</li>
                      <li>• Sharing false or misleading information</li>
                      <li>• Using the service to harass or discriminate against others</li>
                      <li>• Violating intellectual property rights</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data and Privacy */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Data and Privacy</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Data Rights</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• You retain ownership of your data</li>
                    <li>• We process data only as necessary for service provision</li>
                    <li>• You can export your data at any time</li>
                    <li>• Data deletion requests are honored promptly</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Commitments</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Industry-standard security measures</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Transparent privacy practices</li>
                    <li>• Compliance with data protection laws</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  For detailed information about how we handle your data, please review our 
                  <Link href="/privacy" className="font-medium underline ml-1">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </section>

          {/* Service Availability */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Service Availability</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold text-lg">99.9%</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Uptime Target</h3>
                  <p className="text-sm text-gray-600">We strive to maintain 99.9% service availability.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Maintenance</h3>
                  <p className="text-sm text-gray-600">Scheduled maintenance with advance notice.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                  <p className="text-sm text-gray-600">24/7 technical support for critical issues.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by applicable law, PRIMA HR Management System shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
              </p>
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                <p className="text-yellow-800 text-sm font-medium">
                  Our total liability for any claims arising from or related to this agreement shall not exceed 
                  the amount paid by you for the service during the twelve (12) months preceding the claim.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Termination</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">By You</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Cancel your account at any time</li>
                    <li>• Export your data before termination</li>
                    <li>• 30-day data retention period</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">By Us</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Violation of terms of service</li>
                    <li>• Non-payment of fees</li>
                    <li>• 30-day notice for convenience</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            © {new Date().getFullYear()} PRIMA HR Management System. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-blue-600 hover:text-blue-700 transition-colors">
              Cookie Policy
            </Link>
            <Link href="/security" className="text-blue-600 hover:text-blue-700 transition-colors">
              Security
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}