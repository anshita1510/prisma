import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <h1 className="text-xl font-semibold text-gray-900">Privacy Policy</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how PRIMA HR Management System 
            collects, uses, and protects your personal information.
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
          
          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• <strong>Account Information:</strong> Name, email address, phone number, job title, and department</li>
                <li>• <strong>Authentication Data:</strong> Login credentials, OAuth tokens, and session information</li>
                <li>• <strong>Profile Data:</strong> Employee ID, designation, reporting manager, and company details</li>
                <li>• <strong>Contact Information:</strong> Business address, emergency contacts, and communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Operational Data</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• <strong>Attendance Records:</strong> Check-in/check-out times, location data, and work hours</li>
                <li>• <strong>Leave Management:</strong> Leave applications, approvals, balances, and history</li>
                <li>• <strong>Project Data:</strong> Task assignments, project participation, and time tracking</li>
                <li>• <strong>Performance Data:</strong> Goals, reviews, and productivity metrics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Device Information:</strong> IP address, browser type, device type, and operating system</li>
                <li>• <strong>Usage Data:</strong> Pages visited, features used, and interaction patterns</li>
                <li>• <strong>Location Data:</strong> GPS coordinates for attendance tracking (with consent)</li>
                <li>• <strong>Cookies:</strong> Session cookies, preference cookies, and analytics cookies</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use Your Information</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Core HR Functions</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Employee onboarding and management</li>
                    <li>• Attendance and time tracking</li>
                    <li>• Leave management and approvals</li>
                    <li>• Payroll processing and reporting</li>
                    <li>• Performance evaluation and reviews</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">System Operations</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• User authentication and authorization</li>
                    <li>• System security and fraud prevention</li>
                    <li>• Technical support and troubleshooting</li>
                    <li>• Analytics and system improvements</li>
                    <li>• Compliance and audit requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Data Protection & Security</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
                  <p className="text-sm text-gray-600">All data is encrypted in transit and at rest using industry-standard AES-256 encryption.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Access Control</h3>
                  <p className="text-sm text-gray-600">Role-based access control ensures only authorized personnel can access sensitive data.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Backup & Recovery</h3>
                  <p className="text-sm text-gray-600">Regular backups and disaster recovery procedures protect against data loss.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Your Privacy Rights</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Access & Control</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Access:</strong> Request a copy of your personal data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Correction:</strong> Update or correct inaccurate information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Controls</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Portability:</strong> Export your data in a machine-readable format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Restriction:</strong> Limit how we process your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Objection:</strong> Object to certain types of data processing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Contact Us</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <p className="text-gray-700 mb-6">
                If you have any questions about this Privacy Policy or wish to exercise your privacy rights, 
                please contact us using the information below:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Privacy Officer</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> privacy@prima-hr.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> Seasia Infotech, Mohali, Punjab, 160055</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Response Time</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>• <strong>General Inquiries:</strong> 2-3 business days</p>
                    <p>• <strong>Data Requests:</strong> 30 days maximum</p>
                    <p>• <strong>Security Issues:</strong> 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Policy Updates</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, 
                technology, legal requirements, or other factors. When we make changes, we will:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Update the "Last updated" date at the top of this policy</li>
                <li>• Notify you via email if the changes are significant</li>
                <li>• Post a notice on our website for 30 days</li>
                <li>• Obtain your consent for material changes that affect your rights</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            © {new Date().getFullYear()} PRIMA HR Management System. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
              Terms of Service
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