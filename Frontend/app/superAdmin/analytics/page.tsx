'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '../_components/Sidebarr';
import Banner from "../_components/Banner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Building, 
  Activity,
  Calendar,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { analyticsService, AnalyticsData, TimePeriod } from '@/app/services/analytics.service';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('monthly');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading analytics data for period:', selectedPeriod);
      
      const response = await analyticsService.getAnalyticsData(selectedPeriod);
      
      if (response.success) {
        setAnalyticsData(response.analytics);
        console.log('✅ Analytics data loaded:', response.analytics);
      } else {
        throw new Error('Failed to load analytics data');
      }
    } catch (error: any) {
      console.error('❌ Error loading analytics data:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  const handleSelectChange = (value: string) => {
    handlePeriodChange(value as TimePeriod);
  };

  const formatPeriodLabel = (period: string) => {
    if (selectedPeriod === 'weekly') {
      return new Date(period).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } else if (selectedPeriod === 'monthly') {
      const [year, month] = period.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } else {
      return period;
    }
  };

  const getPeriodDisplayName = () => {
    switch (selectedPeriod) {
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      default: return 'Monthly';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <Banner />
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <Banner />
          <div className="p-6">
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">❌ {error}</div>
              <Button onClick={loadAnalyticsData}>Try Again</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Banner />
        <div className="p-6 space-y-8">
          {/* Header with Controls */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">
                Comprehensive system analytics and insights 
                {analyticsData && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} View
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Time Period:</span>
              </div>
              <Select value={selectedPeriod} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={loadAnalyticsData}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Current Totals Cards */}
          {analyticsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.currentTotals.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData.currentTotals.activeUsers} active users
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.currentTotals.totalCompanies}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Organizations registered
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {analyticsData.currentTotals.totalAdmins}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Administrative users
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse">
                      <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Registrations Chart */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    User Registrations ({getPeriodDisplayName()})
                  </CardTitle>
                  <CardDescription>
                    New user registrations over time by role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.userRegistrations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        tickFormatter={formatPeriodLabel}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => formatPeriodLabel(label)}
                      />
                      <Legend />
                      <Bar dataKey="admins" stackId="a" fill="#3B82F6" name="Admins" />
                      <Bar dataKey="managers" stackId="a" fill="#10B981" name="Managers" />
                      <Bar dataKey="employees" stackId="a" fill="#F59E0B" name="Employees" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Company Registrations Chart */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Company Registrations ({getPeriodDisplayName()})
                  </CardTitle>
                  <CardDescription>
                    New company registrations over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.companyRegistrations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        tickFormatter={formatPeriodLabel}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => formatPeriodLabel(label)}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.6}
                        name="Total Companies"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Role Distribution Chart */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Role Distribution (Current)
                  </CardTitle>
                  <CardDescription>
                    Current distribution of user roles across the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {analyticsData.roleDistribution.map((role, index) => (
                      <div key={role.role} className="text-center p-3 rounded-lg border">
                        <div 
                          className="w-4 h-4 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: role.color || COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="text-2xl font-bold text-gray-900">{role.count}</div>
                        <div className="text-sm text-gray-600">{role.role}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pie Chart */}
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={analyticsData.roleDistribution as any}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => {
                          const percent = ((entry.percent || 0) * 100).toFixed(0);
                          return entry.count > 0 ? `${percent}%` : '';
                        }}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analyticsData.roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: any) => [value, `${name} Users`]}
                        labelFormatter={(label: any) => `${label}`}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Activity Trends Chart */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Trends ({getPeriodDisplayName()})
                  </CardTitle>
                  <CardDescription>
                    User activity and engagement over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.activityTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        tickFormatter={formatPeriodLabel}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => formatPeriodLabel(label)}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="activity" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        name="Activity Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Summary Statistics */}
          {analyticsData && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Period Summary ({getPeriodDisplayName()})
                </CardTitle>
                <CardDescription>
                  Analytics summary for {getPeriodDisplayName().toLowerCase()} view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.userRegistrations.reduce((sum, item) => sum + item.total, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total New Users</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.companyRegistrations.reduce((sum, item) => sum + item.total, 0)}
                    </div>
                    <div className="text-sm text-gray-600">New Companies</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analyticsData.userRegistrations.reduce((sum, item) => sum + item.admins, 0)}
                    </div>
                    <div className="text-sm text-gray-600">New Admins</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {analyticsData.activityTrends.reduce((sum, item) => sum + item.activity, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Activity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center text-red-600">
                  <div className="text-lg font-semibold mb-2">Failed to Load Analytics</div>
                  <p className="text-sm mb-4">{error}</p>
                  <Button onClick={loadAnalyticsData} variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}