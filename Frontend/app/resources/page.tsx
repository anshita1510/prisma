"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Video, FileText, Download, ExternalLink, Clock, Search } from "lucide-react";
import { useState } from "react";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const resources = [
    {
      category: "Getting Started",
      items: [
        {
          title: "Quick Start Guide",
          description: "Get up and running with PRIMA in under 10 minutes",
          type: "Guide",
          icon: <BookOpen className="w-5 h-5" />,
          readTime: "5 min read",
          link: "/resources/quick-start",
          keywords: ["quick", "start", "guide", "setup", "getting started", "begin"]
        },
        {
          title: "Setup Walkthrough Video",
          description: "Step-by-step video tutorial for initial setup",
          type: "Video",
          icon: <Video className="w-5 h-5" />,
          readTime: "12 min watch",
          link: "/resources/setup-video",
          keywords: ["setup", "video", "tutorial", "walkthrough", "installation"]
        },
        {
          title: "Best Practices Checklist",
          description: "Essential tips for optimal PRIMA implementation",
          type: "Checklist",
          icon: <FileText className="w-5 h-5" />,
          readTime: "3 min read",
          link: "/resources/best-practices",
          keywords: ["best practices", "checklist", "tips", "optimization", "implementation"]
        }
      ]
    },
    {
      category: "User Guides",
      items: [
        {
          title: "Employee Management",
          description: "Complete guide to managing employee profiles and data",
          type: "Guide",
          icon: <BookOpen className="w-5 h-5" />,
          readTime: "8 min read",
          link: "/resources/employee-management",
          keywords: ["employee", "management", "profiles", "data", "hr", "staff"]
        },
        {
          title: "Attendance Tracking",
          description: "Master attendance features and reporting",
          type: "Guide",
          icon: <BookOpen className="w-5 h-5" />,
          readTime: "6 min read",
          link: "/resources/attendance-tracking",
          keywords: ["attendance", "tracking", "time", "reporting", "clock in", "clock out"]
        },
        {
          title: "Leave Management",
          description: "Configure and manage leave policies effectively",
          type: "Guide",
          icon: <BookOpen className="w-5 h-5" />,
          readTime: "7 min read",
          link: "/resources/leave-management",
          keywords: ["leave", "vacation", "policies", "time off", "absence", "holidays"]
        }
      ]
    },
    {
      category: "Advanced Features",
      items: [
        {
          title: "API Documentation",
          description: "Complete API reference for developers",
          type: "Documentation",
          icon: <FileText className="w-5 h-5" />,
          readTime: "Reference",
          link: "/resources/api-docs",
          keywords: ["api", "documentation", "developers", "integration", "reference", "endpoints"]
        },
        {
          title: "Custom Integrations",
          description: "Build custom integrations with third-party tools",
          type: "Guide",
          icon: <BookOpen className="w-5 h-5" />,
          readTime: "15 min read",
          link: "/resources/integrations",
          keywords: ["integrations", "custom", "third-party", "tools", "connect", "sync"]
        },
        {
          title: "Advanced Analytics",
          description: "Leverage powerful reporting and analytics features",
          type: "Guide",
          icon: <BookOpen className="w-5 h-5" />,
          readTime: "10 min read",
          link: "/resources/analytics",
          keywords: ["analytics", "reporting", "data", "insights", "metrics", "dashboard"]
        }
      ]
    }
  ];

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const allItems = resources.flatMap(category => 
      category.items.map(item => ({
        ...item,
        category: category.category
      }))
    );

    const filtered = allItems.filter(item => {
      const searchTerm = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    });

    setSearchResults(filtered);
  };

  const downloads = [
    {
      title: "PRIMA Mobile App",
      description: "Download our mobile app for iOS and Android",
      platforms: ["iOS", "Android"],
      icon: <Download className="w-6 h-6" />
    },
    {
      title: "Implementation Template",
      description: "Excel template for planning your PRIMA rollout",
      platforms: ["Excel"],
      icon: <Download className="w-6 h-6" />
    },
    {
      title: "Security Whitepaper",
      description: "Detailed overview of our security measures",
      platforms: ["PDF"],
      icon: <Download className="w-6 h-6" />
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
            <h1 className="text-xl font-semibold text-gray-900">Resources</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Resources & Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to get the most out of PRIMA. From quick start guides 
            to advanced tutorials, we've got you covered.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-6 py-4 pl-12 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Search Results for "{searchQuery}" ({searchResults.length} found)
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {item.type}
                          </span>
                          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>{item.readTime}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try searching with different keywords or browse our categories below.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Resource Categories - Only show when not searching */}
        {!searchQuery && (
          <div className="space-y-12 mb-16">
            {resources.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">{category.category}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.link}
                      className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              {item.type}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{item.readTime}</span>
                            </div>
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Downloads Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Downloads</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {downloads.map((download, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    {download.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{download.title}</h3>
                    <div className="flex gap-2 mt-1">
                      {download.platforms.map((platform, platformIndex) => (
                        <span
                          key={platformIndex}
                          className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{download.description}</p>
                <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you 
            get the most out of PRIMA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="border border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}