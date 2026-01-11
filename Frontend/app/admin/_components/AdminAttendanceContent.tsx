'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  BarChart3,
  UserCheck,
  Timer
} from 'lucide-react';

const ATTENDANCE_STATS = [
  { title: 'Total Employees', value: '24', icon: Users, change: '+2 this month', color: 'blue' },
  { title: 'Present Today', value: '22', icon: CheckCircle, change: '91.7% attendance', color: 'green' },
  { title: 'Late Arrivals', value: '3', icon: Clock, change: '12.5% of present', color: 'yellow' },
  { title: 'On Leave', value: '2', icon: XCircle, change: '8.3% of total', color: 'red' },
];

const RECENT_ACTIVITY = [
  { id: 1, user: 'John Doe', action: 'Checked In', time: '09:15 AM', status: 'late' },
  { id: 2, user: 'Jane Smith', action: 'Checked Out', time: '06:30 PM', status: 'normal' },
  { id: 3, user: 'Mike Johnson', action: 'Applied Leave', time: '08:45 AM', status: 'pending' },
  { id: 4, user: 'Sarah Wilson', action: 'Checked In', time: '09:00 AM', status: 'normal' },
  { id: 5, user: 'David Brown', action: 'Late Check In', time: '10:30 AM', status: 'late' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'bg-green-100 text-green-800';
    case 'late':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatColor = (color: string) => {
  switch (color) {
    case 'blue':
      return 'text-blue-600';
    case 'green':
      return 'text-green-600';
    case 'yellow':
      return 'text-yellow-600';
    case 'red':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export default function AdminAttendanceContent() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: true 
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      );
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage team attendance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{currentTime}</div>
          <div className="text-sm text-gray-500">{currentDate}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ATTENDANCE_STATS.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${getStatColor(stat.color)}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common attendance management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Attendance Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Leave Requests
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Set Work Hours
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertCircle className="mr-2 h-4 w-4" />
              Review Late Arrivals
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest attendance updates from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Attendance Overview
          </CardTitle>
          <CardDescription>
            Weekly attendance summary and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-green-700">This Week</div>
              <div className="text-xs text-green-600 mt-1">+2% from last week</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-blue-700">This Month</div>
              <div className="text-xs text-blue-600 mt-1">+1% from last month</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">91%</div>
              <div className="text-sm text-purple-700">This Quarter</div>
              <div className="text-xs text-purple-600 mt-1">+3% from last quarter</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Admin Attendance Management
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                As an admin, you have full access to attendance management features including 
                viewing all employee attendance, managing leave requests, generating reports, 
                and configuring attendance policies.
              </p>
            </div>
            <div className="mt-4">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Access Full Attendance System
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}