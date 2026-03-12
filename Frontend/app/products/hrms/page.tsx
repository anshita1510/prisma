import Link from "next/link";
import { ArrowLeft, Users, Calendar, FileText, BarChart3, Shield, Zap } from "lucide-react";

export default function HRMSPage() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Employee Management",
      description: "Centralized employee database with comprehensive profiles, organizational charts, and role management."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Attendance Tracking",
      description: "Real-time attendance monitoring with GPS tracking, shift management, and automated reporting."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Leave Management",
      description: "Streamlined leave requests, approvals, and balance tracking with customizable policies."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Reviews",
      description: "360-degree feedback system with goal tracking and performance analytics."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compliance Management",
      description: "Stay compliant with labor laws and regulations with automated compliance tracking."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Workflow Automation",
      description: "Automate repetitive HR tasks and create custom workflows for your organization."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">HRMS</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Human Resource Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your HR operations with our comprehensive HRMS solution. 
            Manage employees, track attendance, handle leave requests, and more - all in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose PRIMA HRMS?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Our HRMS is designed to simplify complex HR processes and empower your team to focus on what matters most.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50%</div>
              <div className="text-blue-100">Reduction in HR Admin Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">System Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of companies already using PRIMA HRMS to streamline their HR processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}