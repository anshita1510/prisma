'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  FolderOpen, 
  CheckSquare, 
  BarChart3, 
  Users, 
  Calendar,
  Target,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EnhancedTMSPage() {
  const router = useRouter();

  const features = [
    {
      icon: FolderOpen,
      title: 'Project Management',
      description: 'Create and manage projects with comprehensive tracking',
      href: '/enhanced-tms/projects',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Organize tasks with priorities, deadlines, and dependencies',
      href: '/enhanced-tms/tasks',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Calendar,
      title: 'Calendar View',
      description: 'Visualize project timelines and task schedules',
      href: '/enhanced-tms/calendar',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Track progress with detailed analytics and reports',
      href: '/enhanced-tms/reports',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Collaborate with team members and manage assignments',
      href: '/enhanced-tms/team',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and track milestones and project goals',
      href: '/enhanced-tms/goals',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  const quickStats = [
    { label: 'Active Projects', value: '12', icon: FolderOpen, color: 'text-blue-600' },
    { label: 'Total Tasks', value: '156', icon: CheckSquare, color: 'text-green-600' },
    { label: 'Team Members', value: '24', icon: Users, color: 'text-purple-600' },
    { label: 'Completion Rate', value: '87%', icon: TrendingUp, color: 'text-orange-600' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center slide-in-from-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced Task Management System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your workflow with our comprehensive project and task management solution. 
            Built for teams that demand efficiency and results.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-in-from-bottom">
          {quickStats.map((stat, index) => (
            <Card key={stat.label} className="card-hover animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 slide-in-from-bottom">
          <Button 
            size="lg" 
            onClick={() => router.push('/enhanced-tms/dashboard')}
            className="animate-pulse-glow"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push('/enhanced-tms/projects')}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Project
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="card-hover cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => router.push(feature.href)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {feature.title}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start p-0">
                  Explore Feature
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Preview */}
        <Card className="slide-in-from-bottom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your projects and tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Task "User Authentication" completed</p>
                  <p className="text-xs text-muted-foreground">Mobile App Development • 2 hours ago</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New project "Website Redesign" created</p>
                  <p className="text-xs text-muted-foreground">Design Team • 4 hours ago</p>
                </div>
                <Badge variant="outline">New</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Milestone "Beta Release" reached</p>
                  <p className="text-xs text-muted-foreground">API Integration Project • 6 hours ago</p>
                </div>
                <Badge variant="secondary">Milestone</Badge>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => router.push('/enhanced-tms/dashboard')}
              >
                View All Activity
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-12 slide-in-from-bottom">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to boost your productivity?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who have transformed their workflow with our Enhanced TMS. 
            Start managing your projects more efficiently today.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg"
              onClick={() => router.push('/enhanced-tms/dashboard')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/enhanced-tms/projects')}
            >
              View Projects
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}