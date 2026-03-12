import Link from "next/link";
import { ArrowLeft, Cookie, Settings, BarChart3, Shield, Eye, Trash2 } from "lucide-react";

export default function CookiePolicyPage() {
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
            <h1 className="text-xl font-semibold text-gray-900">Cookie Policy</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
            <Cookie className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This policy explains how PRIMA HR Management System uses cookies and similar technologies 
            to enhance your experience and improve our services.
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
          
          {/* What Are Cookies */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">What Are Cookies?</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <p className="text-gray-700 mb-6">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                enabling certain functionality.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Functionality</h3>
                  <p className="text-sm text-gray-600">Remember your login status and preferences</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600">Help us understand how you use our service</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                  <p className="text-sm text-gray-600">Protect against fraud and unauthorized access</p>
                </div>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Types of Cookies We Use</h2>
            </div>
            
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Essential Cookies</h3>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Required</span>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Authentication Cookies</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Session management</li>
                      <li>• Login status</li>
                      <li>• Security tokens</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Functional Cookies</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Language preferences</li>
                      <li>• Theme settings</li>
                      <li>• Form data</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Performance Cookies</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Optional</span>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies help us understand how visitors interact with our website by collecting anonymous information.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Page views and traffic</li>
                      <li>• User behavior patterns</li>
                      <li>• Performance metrics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Optimization</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Load time monitoring</li>
                      <li>• Error tracking</li>
                      <li>• Feature usage</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Preference Cookies</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Optional</span>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies remember your choices and preferences to provide a personalized experience.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customization</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Dashboard layout</li>
                      <li>• Notification settings</li>
                      <li>• Display preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">User Experience</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Recently viewed items</li>
                      <li>• Saved filters</li>
                      <li>• Timezone settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Management */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Managing Your Cookies</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Settings</h3>
                  <p className="text-gray-700 mb-4">
                    You can control cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• View and delete existing cookies</li>
                    <li>• Block cookies from specific sites</li>
                    <li>• Block third-party cookies</li>
                    <li>• Clear all cookies when closing browser</li>
                    <li>• Receive notifications when cookies are set</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Cookie Preferences</h3>
                  <p className="text-gray-700 mb-4">
                    We provide a cookie preference center where you can:
                  </p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Accept or reject optional cookies</li>
                    <li>• View detailed cookie information</li>
                    <li>• Change your preferences anytime</li>
                    <li>• Download your cookie settings</li>
                  </ul>
                  <div className="mt-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Manage Cookie Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 mb-6">
                We may use third-party services that set their own cookies. These services include:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/60 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600 mb-2">Google Analytics, Mixpanel</p>
                  <p className="text-xs text-gray-500">Usage statistics and performance monitoring</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Authentication</h3>
                  <p className="text-sm text-gray-600 mb-2">Google OAuth, Microsoft SSO</p>
                  <p className="text-xs text-gray-500">Single sign-on and social login features</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                  <p className="text-sm text-gray-600 mb-2">Intercom, Zendesk</p>
                  <p className="text-xs text-gray-500">Customer support and help desk functionality</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Retention */}
          <section className="mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Cookie Retention Periods</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Cookie Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Session Cookies</td>
                      <td className="py-3 px-4">Until browser closes</td>
                      <td className="py-3 px-4">Authentication and temporary data</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Persistent Cookies</td>
                      <td className="py-3 px-4">30 days - 2 years</td>
                      <td className="py-3 px-4">Preferences and settings</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Analytics Cookies</td>
                      <td className="py-3 px-4">2 years</td>
                      <td className="py-3 px-4">Usage analysis and improvements</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Security Cookies</td>
                      <td className="py-3 px-4">24 hours</td>
                      <td className="py-3 px-4">Fraud prevention and security</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Questions About Cookies?</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li><strong>Email:</strong> privacy@prima-hr.com</li>
                    <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                    <li><strong>Address:</strong> Seasia Infotech, Mohali, Punjab, 160055</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• General inquiries: 2-3 business days</li>
                    <li>• Technical issues: 24-48 hours</li>
                    <li>• Privacy concerns: Same day</li>
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
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
              Terms of Service
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