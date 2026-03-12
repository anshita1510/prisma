import Link from "next/link";
import { ArrowLeft, BarChart3, PieChart, TrendingUp, Users, Clock, Target } from "lucide-react";

export default function AnalyticsPage() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Dashboards",
      description: "Interactive dashboards with real-time HR metrics and KPIs for instant insights into your workforce."
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Custom Reports",
      description: "Create custom reports with drag-and-drop interface to analyze specific HR metrics that matter to you."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Predictive Analytics",
      description: "Use AI-powered analytics to predict employee turnover, performance trends, and workforce planning needs."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Employee Insights",
      description: "Deep dive into employee performance, engagement, and satisfaction metrics with detailed analytics."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time & Attendance Analytics",
      description: "Analyze attendance patterns, overtime trends, and productivity metrics across your organization."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Goal Tracking",
      description: "Track and analyze goal completion rates, performance metrics, and team productivity over time."
    }
  ];

  const metrics = [
    {
      title: "Employee Turnover Rate",
      description: "Track and analyze turnover patterns to improve retention strategies"
    },
    {
      title: "Attendance & Punctuality",
      description: "Monitor attendance trends and identify patterns across departments"
    },
    {
      title: "Performance Metrics",
      description: "Analyze employee performance data and identify top performers"
    },
    {
      title: "Training Effectiveness",
      description: "Measure the impact of training programs on employee performance"
    },
    {
      title: "Recruitment Analytics",
      description: "Track hiring metrics, time-to-fill, and recruitment source effectiveness"
    },
    {
      title: "Compensation Analysis",
      description: "Analyze salary trends, pay equity, and compensation benchmarking"
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
            <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            HR Analytics & Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your HR data into actionable insights. Make data-driven decisions 
            with powerful analytics, custom reports, and predictive intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 text-purple-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Metrics Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Key HR Metrics You Can Track</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{metric.title}</h3>
                <p className="text-gray-600 text-sm">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Sample Analytics Dashboard</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">1,247</div>
              <div className="text-blue-100 text-sm">Total Employees</div>
              <div className="text-green-300 text-xs mt-2">↑ 12% from last month</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">94.2%</div>
              <div className="text-green-100 text-sm">Attendance Rate</div>
              <div className="text-green-300 text-xs mt-2">↑ 2.1% from last month</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">8.5%</div>
              <div className="text-purple-100 text-sm">Turnover Rate</div>
              <div className="text-red-300 text-xs mt-2">↓ 1.2% from last month</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">4.7/5</div>
              <div className="text-orange-100 text-sm">Employee Satisfaction</div>
              <div className="text-green-300 text-xs mt-2">↑ 0.3 from last quarter</div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose PRIMA Analytics?</h2>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Turn your HR data into your competitive advantage with intelligent analytics and insights.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-purple-100">Pre-built Reports</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Real-time</div>
              <div className="text-purple-100">Data Updates</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">AI-Powered</div>
              <div className="text-purple-100">Predictions</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Unlock Your HR Data?
          </h2>
          <p className="text-gray-600 mb-8">
            Start making data-driven HR decisions with PRIMA Analytics today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View Sample Reports
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}