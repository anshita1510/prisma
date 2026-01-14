'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Sidebar from "../_components/sidebar_m";
import Banner from "../_components/Banner";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Users,
  Filter,
  Search
} from 'lucide-react';
import { leaveService, Leave } from '@/app/services/leave.service';
import { authService } from '@/app/services/authService';
import { formatRole } from '@/app/utils/roleFormatter';

export default function ManagerLeaveManagement() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    const token = authService.getToken();
    
    if (!currentUser || !token) {
      setError('Please log in to access this page');
      return;
    }
    
    if (!['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(currentUser.role)) {
      setError('Access denied. Manager role required.');
      return;
    }
    
    setUser(currentUser);
    loadAllLeaves();
  }, []);

  useEffect(() => {
    filterLeaves();
  }, [leaves, activeTab]);

  const loadAllLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await leaveService.getAllLeaves();
      
      if (response.success && response.leaves) {
        setLeaves(response.leaves);
      } else {
        setError('Failed to load leaves: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Load leaves error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const filterLeaves = () => {
    let filtered = leaves;
    
    switch (activeTab) {
      case 'pending':
        filtered = leaves.filter(leave => leave.status === 'PENDING');
        break;
      case 'approved':
        filtered = leaves.filter(leave => leave.status === 'APPROVED');
        break;
      case 'rejected':
        filtered = leaves.filter(leave => leave.status === 'REJECTED');
        break;
      default:
        filtered = leaves;
    }
    
    setFilteredLeaves(filtered);
  };

  const handleApproveLeave = async (leaveId: number) => {
    try {
      console.log('🟢 Manager approving leave ID:', leaveId);
      
      // Check if user is still authenticated
      const token = authService.getToken();
      if (!token) {
        setError('Session expired. Please log in again.');
        return;
      }
      
      setActionLoading(true);
      setError('');
      setSuccess('');

      console.log('🟢 Calling leaveService.updateLeaveStatus...');
      const response = await leaveService.updateLeaveStatus(leaveId, 'APPROVED');
      console.log('🟢 Response received:', response);
      
      if (response.success) {
        setSuccess('Leave application approved successfully!');
        console.log('🟢 Success! Reloading leaves...');
        await loadAllLeaves(); // Refresh the list
      } else {
        console.error('🔴 Failed to approve leave:', response);
        setError('Failed to approve leave: ' + (response.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('🔴 Approve leave error:', err);
      
      // Handle specific error cases
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('Session expired. Please log in again.');
      } else if (err.message?.includes('No authentication token')) {
        setError('Please log in to perform this action.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to approve leave');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectLeave = async (leaveId: number) => {
    try {
      console.log('🔴 Manager rejecting leave ID:', leaveId);
      
      // Check if user is still authenticated
      const token = authService.getToken();
      if (!token) {
        setError('Session expired. Please log in again.');
        return;
      }
      
      setActionLoading(true);
      setError('');
      setSuccess('');

      console.log('🔴 Calling leaveService.updateLeaveStatus...');
      const response = await leaveService.updateLeaveStatus(leaveId, 'REJECTED');
      console.log('🔴 Response received:', response);
      
      if (response.success) {
        setSuccess('Leave application rejected successfully!');
        setShowRejectDialog(false);
        setRejectionReason('');
        setSelectedLeave(null);
        console.log('🔴 Success! Reloading leaves...');
        await loadAllLeaves(); // Refresh the list
      } else {
        console.error('🔴 Failed to reject leave:', response);
        setError('Failed to reject leave: ' + (response.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('🔴 Reject leave error:', err);
      
      // Handle specific error cases
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('Session expired. Please log in again.');
      } else if (err.message?.includes('No authentication token')) {
        setError('Please log in to perform this action.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to reject leave');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colorClass = leaveService.getStatusColor(status);
    return (
      <Badge className={`${colorClass} border-0`}>
        {status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
        {status === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  const getTabCounts = () => {
    return {
      all: leaves.length,
      pending: leaves.filter(l => l.status === 'PENDING').length,
      approved: leaves.filter(l => l.status === 'APPROVED').length,
      rejected: leaves.filter(l => l.status === 'REJECTED').length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Banner />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600 mt-1">Review and manage team leave applications</p>
          </div>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                All ({tabCounts.all})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending ({tabCounts.pending})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approved ({tabCounts.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejected ({tabCounts.rejected})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Team Leave Applications
                  </CardTitle>
                  <CardDescription>
                    {activeTab === 'all' && 'All team leave applications'}
                    {activeTab === 'pending' && 'Leave applications awaiting your review'}
                    {activeTab === 'approved' && 'Approved leave applications'}
                    {activeTab === 'rejected' && 'Rejected leave applications'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : filteredLeaves.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {activeTab === 'pending' ? 'No pending leave applications' : 
                         activeTab === 'approved' ? 'No approved leave applications' :
                         activeTab === 'rejected' ? 'No rejected leave applications' :
                         'No leave applications found'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredLeaves.map((leave) => (
                        <div 
                          key={leave.id} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-medium text-lg">
                                  {leaveService.formatLeaveType(leave.type)}
                                </h3>
                                {getStatusBadge(leave.status)}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium text-gray-900">Employee:</span>
                                  <br />
                                  {(leave as any).employee?.name || 'Unknown Employee'}
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    {(leave as any).employee?.employeeCode}
                                  </span>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-900">Duration:</span>
                                  <br />
                                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    ({leaveService.calculateLeaveDays(leave.startDate, leave.endDate)} days)
                                  </span>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-900">Department:</span>
                                  <br />
                                  {leave.department}
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-900">Applied:</span>
                                  <br />
                                  {new Date(leave.createdAt).toLocaleDateString()}
                                  {leave.approvedBy && (
                                    <>
                                      <br />
                                      <span className="text-xs font-medium text-blue-600">
                                        Approved by: {leave.approvedBy}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {leave.reason && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                  <span className="font-medium text-gray-900">Reason:</span>
                                  <p className="text-sm text-gray-700 mt-1">{leave.reason}</p>
                                </div>
                              )}

                              {leave.status !== 'PENDING' && leave.approvedBy && (
                                <div className={`mt-3 p-3 rounded-md ${
                                  leave.status === 'APPROVED' 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-red-50 border border-red-200'
                                }`}>
                                  <div className="flex items-center gap-2">
                                    {leave.status === 'APPROVED' ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <span className={`text-sm font-medium ${
                                      leave.status === 'APPROVED' ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                      {leave.status === 'APPROVED' ? 'Approved' : 'Rejected'} by {leave.approvedBy}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">
                                    on {new Date(leave.updatedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {leave.status === 'PENDING' && (
                                <>
                                  <Button
                                    onClick={() => handleApproveLeave(leave.id)}
                                    disabled={actionLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  
                                  <Button
                                    onClick={() => {
                                      setSelectedLeave(leave);
                                      setShowRejectDialog(true);
                                    }}
                                    disabled={actionLoading}
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    size="sm"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Reject Leave Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this leave application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Leave Details:</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Employee:</strong> {(selectedLeave as any).employee?.name}<br />
                  <strong>Type:</strong> {leaveService.formatLeaveType(selectedLeave.type)}<br />
                  <strong>Duration:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason (Optional)</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason('');
                    setSelectedLeave(null);
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => selectedLeave && handleRejectLeave(selectedLeave.id)}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {actionLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Rejecting...
                    </div>
                  ) : (
                    'Reject Leave'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}