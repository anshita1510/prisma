import Link from "next/link";
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Heart, Zap, Award, Coffee } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Join our frontend team to build beautiful, responsive user interfaces using React, TypeScript, and modern web technologies.",
      requirements: ["5+ years React experience", "TypeScript proficiency", "UI/UX design sense"],
      posted: "2 days ago"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote / New York",
      type: "Full-time", 
      salary: "$130k - $170k",
      description: "Lead product strategy and roadmap for our core HR management platform, working closely with engineering and design teams.",
      requirements: ["3+ years PM experience", "B2B SaaS background", "Data-driven mindset"],
      posted: "1 week ago"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote / Austin",
      type: "Full-time",
      salary: "$80k - $110k", 
      description: "Help our customers achieve success with PRIMA by providing guidance, training, and ongoing support.",
      requirements: ["2+ years CS experience", "HR domain knowledge", "Excellent communication"],
      posted: "3 days ago"
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote / Seattle",
      type: "Full-time",
      salary: "$110k - $150k",
      description: "Build and maintain our cloud infrastructure, CI/CD pipelines, and monitoring systems to ensure 99.9% uptime.",
      requirements: ["AWS/GCP experience", "Kubernetes knowledge", "Infrastructure as Code"],
      posted: "5 days ago"
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "Remote / Los Angeles", 
      type: "Full-time",
      salary: "$90k - $130k",
      description: "Design intuitive user experiences for our HR platform, conducting user research and creating wireframes and prototypes.",
      requirements: ["3+ years UX experience", "Figma proficiency", "User research skills"],
      posted: "1 week ago"
    },
    {
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote / Chicago",
      type: "Full-time",
      salary: "$60k - $80k + Commission",
      description: "Generate qualified leads and build relationships with potential customers in the HR technology space.",
      requirements: ["1+ years sales experience", "B2B background preferred", "Strong communication"],
      posted: "4 days ago"
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance plus wellness stipend"
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Flexible Work",
      description: "Remote-first culture with flexible hours and unlimited PTO"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Growth & Learning",
      description: "$2,000 annual learning budget and conference attendance"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Equity & Bonuses",
      description: "Competitive equity package and performance-based bonuses"
    }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We're always pushing boundaries and exploring new technologies to solve complex problems."
    },
    {
      title: "Customer Obsessed", 
      description: "Every decision we make is guided by what's best for our customers and their success."
    },
    {
      title: "Inclusive Culture",
      description: "We celebrate diversity and create an environment where everyone can do their best work."
    },
    {
      title: "Continuous Learning",
      description: "We invest in our team's growth and encourage experimentation and learning from failures."
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
            <h1 className="text-xl font-semibold text-gray-900">Careers</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Join the PRIMA Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Help us build the future of HR technology. We're looking for passionate, 
            talented individuals who want to make a real impact on how companies manage their people.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>50+ team members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>Remote-first culture</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Top-rated workplace</span>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Work at PRIMA?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Open Positions</h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <span className="text-xs text-gray-500 self-end">{job.posted}</span>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{job.description}</p>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Requirements:</h4>
                  <ul className="flex flex-wrap gap-2">
                    {job.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people to join our team. Send us your resume 
            and tell us how you'd like to contribute to PRIMA's mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Send Resume
            </button>
            <button className="border border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Learn More About PRIMA
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}