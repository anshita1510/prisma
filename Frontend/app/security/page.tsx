import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle, CheckCircle, Server, Key } from "lucide-react";

export default function SecurityPage() {
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
            <h1 className="text-xl font-semibold text-gray-900">Security</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your data security is our top priority. Learn about the comprehensive security measures 
            we implement to protect your information and ensure system integrity.
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
          
          {/* Security Overview */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Our Security Commitment</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <p className="text-gray-700 mb-6">
                PRIMA HR Management System employs enterprise-grade security measures to protect your sensitive 
                HR data. Our multi-layered security approach ensures data confidentiality, integrity, and availability.
              </p>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
                  <p className="text-sm text-gray-600">AES-256 encryption for data at rest and in transit</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Key className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Authentication</h3>
                  <p className="text-sm text-gray-600">Multi-factor authentication and OAuth 2.0</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Monitoring</h3>
                  <p className="text-sm text-gray-600">24/7 security monitoring and threat detection</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Server className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Infrastructure</h3>
                  <p className="text-sm text-gray-600">Secure cloud infrastructure with redundancy</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Data Protection</h2>
            </div>
            
            <div className="space-y-6">
              {/* Encryption */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Encryption Standards</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Data at Rest</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• AES-256 encryption for database storage</li>
                      <li>• Encrypted file system and backups</li>
                      <li>• Hardware security modules (HSM)</li>
                      <li>• Key rotation every 90 days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Data in Transit</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• TLS 1.3 for all communications</li>
                      <li>• Certificate pinning and HSTS</li>
                      <li>• End-to-end encryption for sensitive data</li>
                      <li>• Perfect forward secrecy</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Access Control */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Key className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Access Control</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Authentication</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Multi-factor authentication (MFA)</li>
                      <li>• Single Sign-On (SSO) integration</li>
                      <li>• OAuth 2.0 and OpenID Connect</li>
                      <li>• Biometric authentication support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Authorization</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Role-based access control (RBAC)</li>
                      <li>• Principle of least privilege</li>
                      <li>• Dynamic permission management</li>
                      <li>• Regular access reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Infrastructure Security */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Infrastructure Security</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cloud Security</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• SOC 2 Type II certified infrastructure</li>
                    <li>• ISO 27001 compliant data centers</li>
                    <li>• Geographic data residency options</li>
                    <li>• Automated security patching</li>
                    <li>• DDoS protection and mitigation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Security</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Web Application Firewall (WAF)</li>
                    <li>• Intrusion detection systems</li>
                    <li>• Network segmentation</li>
                    <li>• VPN access for administrators</li>
                    <li>• Rate limiting and throttling</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Security</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Secure coding practices</li>
                    <li>• Regular security code reviews</li>
                    <li>• Automated vulnerability scanning</li>
                    <li>• Penetration testing</li>
                    <li>• Security headers and CSP</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Monitoring & Incident Response */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Monitoring & Incident Response</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Monitoring</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 24/7 Security Operations Center (SOC)</li>
                      <li>• Real-time threat detection and analysis</li>
                      <li>• Automated incident response workflows</li>
                      <li>• Security information and event management (SIEM)</li>
                      <li>• Behavioral analytics and anomaly detection</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Response</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Dedicated incident response team</li>
                      <li>• Mean time to detection: &lt; 15 minutes</li>
                      <li>• Mean time to response: &lt; 1 hour</li>
                      <li>• Forensic analysis and root cause investigation</li>
                      <li>• Customer notification within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Security Incident Reporting</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  If you discover a security vulnerability or incident, please report it immediately:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li><strong>Email:</strong> security@prima-hr.com</li>
                      <li><strong>Phone:</strong> +1 (555) 911-SECURITY</li>
                      <li><strong>Response Time:</strong> Within 1 hour</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bug Bounty Program</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Responsible disclosure program</li>
                      <li>• Rewards for valid security findings</li>
                      <li>• Hall of fame recognition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Compliance & Certifications */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Compliance & Certifications</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <p className="text-gray-700 mb-6">
                PRIMA maintains compliance with industry standards and regulations to ensure the highest 
                level of security and data protection.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold text-sm">SOC 2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">SOC 2 Type II</h3>
                  <p className="text-xs text-gray-600">Security, availability, and confidentiality controls</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold text-sm">ISO</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
                  <p className="text-xs text-gray-600">Information security management system</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold text-sm">GDPR</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">GDPR</h3>
                  <p className="text-xs text-gray-600">General Data Protection Regulation compliance</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold text-sm">CCPA</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">CCPA</h3>
                  <p className="text-xs text-gray-600">California Consumer Privacy Act compliance</p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Best Practices */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Security Best Practices for Users</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <p className="text-gray-700 mb-6">
                Help us keep your data secure by following these security best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Use strong, unique passwords for your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Enable multi-factor authentication (MFA)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Log out when using shared computers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Regularly review your account activity</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Protection</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Keep your browser and devices updated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Be cautious with public Wi-Fi networks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Report suspicious activities immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Verify URLs before entering credentials</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Security Updates */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Security Updates & Transparency</h2>
              <p className="text-gray-700 mb-6">
                We believe in transparency and keep our users informed about security matters:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security Bulletins</h3>
                  <p className="text-sm text-gray-600">Regular updates on security enhancements and patches</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Incident Reports</h3>
                  <p className="text-sm text-gray-600">Transparent reporting of any security incidents</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security Roadmap</h3>
                  <p className="text-sm text-gray-600">Upcoming security features and improvements</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Subscribe to our security newsletter to stay informed about the latest security updates and best practices.
                </p>
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
            <Link href="/cookies" className="text-blue-600 hover:text-blue-700 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}