import Link from "next/link";
import { ArrowLeft, DollarSign, Calculator, FileText, Shield, Clock, TrendingUp } from "lucide-react";

export default function PayrollPage() {
  const features = [
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Automated Calculations",
      description: "Accurate salary calculations with tax deductions, benefits, and overtime automatically computed."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Integration",
      description: "Seamlessly integrate with attendance data for precise payroll processing based on actual hours worked."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Payslip Generation",
      description: "Generate detailed payslips with breakdown of earnings, deductions, and net pay for each employee."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Tax Compliance",
      description: "Stay compliant with local tax regulations and automatically generate required tax reports."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Payroll Analytics",
      description: "Comprehensive reporting and analytics to track payroll costs and trends over time."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Multi-Currency Support",
      description: "Handle payroll for global teams with support for multiple currencies and exchange rates."
    }
  ];

  const benefits = [
    "Reduce payroll processing time by 75%",
    "Eliminate calculation errors with automation",
    "Ensure 100% tax compliance",
    "Provide employee self-service portal",
    "Generate comprehensive payroll reports",
    "Support for complex pay structures"
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
            <h1 className="text-xl font-semibold text-gray-900">Payroll</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Payroll Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simplify payroll processing with our automated system. Handle complex calculations, 
            ensure tax compliance, and provide transparency to your employees.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 text-green-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Benefits</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Payroll Process</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                <span className="text-gray-700">Import attendance and time data</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                <span className="text-gray-700">Calculate salaries and deductions</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                <span className="text-gray-700">Review and approve payroll</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                <span className="text-gray-700">Generate payslips and reports</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">5</div>
                <span className="text-gray-700">Process payments and notifications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Payroll by the Numbers</h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              See how PRIMA Payroll is transforming payroll processing for companies worldwide.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">75%</div>
              <div className="text-green-100">Time Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-green-100">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Countries Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Support Available</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Streamline Your Payroll?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of companies using PRIMA Payroll to automate their payroll processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}