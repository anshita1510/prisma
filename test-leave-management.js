/**
 * Leave Management System - Test Script
 * 
 * This script tests the complete leave management workflow including:
 * - Leave application
 * - Role-based approvals
 * - Notification system
 * - Permission checks
 */

const API_URL = 'http://localhost:5004/api';

// Test tokens (replace with actual tokens from your system)
const TOKENS = {
  employee: 'YOUR_EMPLOYEE_TOKEN',
  manager: 'YOUR_MANAGER_TOKEN',
  hr: 'YOUR_HR_TOKEN',
  ceo: 'YOUR_CEO_TOKEN'
};

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

// Test 1: Employee applies for leave
async function testEmployeeLeaveApplication() {
  console.log('\n🧪 Test 1: Employee Leave Application');
  console.log('=====================================');

  const leaveData = {
    type: 'CASUAL',
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    endDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    reason: 'Personal work'
  };

  const result = await apiCall('/leave', 'POST', leaveData, TOKENS.employee);
  
  if (result.status === 201 && result.data.success) {
    console.log('✅ Leave application successful');
    console.log('📋 Leave ID:', result.data.leave.id);
    console.log('📅 Duration:', result.data.leave.startDate, 'to', result.data.leave.endDate);
    console.log('📊 Status:', result.data.leave.status);
    return result.data.leave.id;
  } else {
    console.log('❌ Leave application failed');
    console.log('Error:', result.data.error || result.error);
    return null;
  }
}

// Test 2: Get approvable leaves (Manager)
async function testManagerGetApprovableLeaves() {
  console.log('\n🧪 Test 2: Manager - Get Approvable Leaves');
  console.log('==========================================');

  const result = await apiCall('/leave/approvable', 'GET', null, TOKENS.manager);
  
  if (result.status === 200 && result.data.success) {
    console.log('✅ Successfully fetched approvable leaves');
    console.log('📊 Count:', result.data.count);
    console.log('📋 Leaves:', result.data.leaves.map(l => ({
      id: l.id,
      employee: l.employee.name,
      type: l.type,
      status: l.status
    })));
    return result.data.leaves;
  } else {
    console.log('❌ Failed to fetch approvable leaves');
    console.log('Error:', result.data.error || result.error);
    return [];
  }
}

// Test 3: Manager approves employee leave
async function testManagerApproveLeave(leaveId) {
  console.log('\n🧪 Test 3: Manager Approves Employee Leave');
  console.log('==========================================');

  const result = await apiCall(
    `/leave/${leaveId}/status`,
    'PATCH',
    { status: 'APPROVED' },
    TOKENS.manager
  );
  
  if (result.status === 200 && result.data.success) {
    console.log('✅ Leave approved successfully');
    console.log('📋 Leave ID:', result.data.leave.id);
    console.log('📊 Status:', result.data.leave.status);
    console.log('👤 Approved by:', result.data.leave.approvedBy);
    console.log('💬 Message:', result.data.message);
    return true;
  } else {
    console.log('❌ Leave approval failed');
    console.log('Error:', result.data.error || result.error);
    return false;
  }
}

// Test 4: Manager applies for leave
async function testManagerLeaveApplication() {
  console.log('\n🧪 Test 4: Manager Leave Application');
  console.log('====================================');

  const leaveData = {
    type: 'SICK',
    startDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days from now
    endDate: new Date(Date.now() + 345600000).toISOString().split('T')[0], // 4 days from now
    reason: 'Medical appointment'
  };

  const result = await apiCall('/leave', 'POST', leaveData, TOKENS.manager);
  
  if (result.status === 201 && result.data.success) {
    console.log('✅ Manager leave application successful');
    console.log('📋 Leave ID:', result.data.leave.id);
    console.log('📊 Status:', result.data.leave.status);
    console.log('💬 Message:', result.data.message);
    return result.data.leave.id;
  } else {
    console.log('❌ Manager leave application failed');
    console.log('Error:', result.data.error || result.error);
    return null;
  }
}

// Test 5: HR approves manager leave
async function testHRApproveManagerLeave(leaveId) {
  console.log('\n🧪 Test 5: HR Approves Manager Leave');
  console.log('====================================');

  const result = await apiCall(
    `/leave/${leaveId}/status`,
    'PATCH',
    { status: 'APPROVED' },
    TOKENS.hr
  );
  
  if (result.status === 200 && result.data.success) {
    console.log('✅ Manager leave approved by HR');
    console.log('📋 Leave ID:', result.data.leave.id);
    console.log('📊 Status:', result.data.leave.status);
    console.log('👤 Approved by:', result.data.leave.approvedBy);
    return true;
  } else {
    console.log('❌ HR approval failed');
    console.log('Error:', result.data.error || result.error);
    return false;
  }
}

// Test 6: Get leave notifications
async function testGetNotifications(token, role) {
  console.log(`\n🧪 Test 6: Get Notifications (${role})`);
  console.log('=====================================');

  const result = await apiCall('/leave/notifications', 'GET', null, token);
  
  if (result.status === 200 && result.data.success) {
    console.log('✅ Successfully fetched notifications');
    console.log('📊 Total:', result.data.notifications.length);
    console.log('🔔 Unread:', result.data.unreadCount);
    console.log('📋 Recent notifications:');
    result.data.notifications.slice(0, 3).forEach(n => {
      console.log(`  - ${n.title}: ${n.message} (${n.isRead ? 'Read' : 'Unread'})`);
    });
    return result.data.notifications;
  } else {
    console.log('❌ Failed to fetch notifications');
    console.log('Error:', result.data.error || result.error);
    return [];
  }
}

// Test 7: Get leave statistics
async function testGetStatistics(token, role) {
  console.log(`\n🧪 Test 7: Get Leave Statistics (${role})`);
  console.log('========================================');

  const result = await apiCall('/leave/statistics', 'GET', null, token);
  
  if (result.status === 200 && result.data.success) {
    console.log('✅ Successfully fetched statistics');
    console.log('📊 Statistics:', {
      total: result.data.statistics.total,
      pending: result.data.statistics.pending,
      approved: result.data.statistics.approved,
      rejected: result.data.statistics.rejected
    });
    console.log('📋 By Type:', result.data.statistics.byType);
    return result.data.statistics;
  } else {
    console.log('❌ Failed to fetch statistics');
    console.log('Error:', result.data.error || result.error);
    return null;
  }
}

// Test 8: Test permission checks
async function testPermissionChecks(leaveId) {
  console.log('\n🧪 Test 8: Permission Checks');
  console.log('============================');

  // Test 8a: Employee cannot approve
  console.log('\n8a. Employee trying to approve (should fail):');
  const employeeResult = await apiCall(
    `/leave/${leaveId}/status`,
    'PATCH',
    { status: 'APPROVED' },
    TOKENS.employee
  );
  
  if (employeeResult.status === 403) {
    console.log('✅ Correctly blocked employee from approving');
  } else {
    console.log('❌ Employee was able to approve (security issue!)');
  }

  // Test 8b: Check approval permission
  console.log('\n8b. Check approval permission:');
  const permResult = await apiCall(
    `/leave/${leaveId}/can-approve`,
    'GET',
    null,
    TOKENS.manager
  );
  
  if (permResult.status === 200 && permResult.data.success) {
    console.log('✅ Permission check successful');
    console.log('📋 Can approve:', permResult.data.permission.canApprove);
    console.log('💬 Reason:', permResult.data.permission.reason || 'Authorized');
  } else {
    console.log('❌ Permission check failed');
  }
}

// Test 9: Test rejection with reason
async function testLeaveRejection() {
  console.log('\n🧪 Test 9: Leave Rejection with Reason');
  console.log('======================================');

  // First apply for leave
  const leaveData = {
    type: 'UNPAID',
    startDate: new Date(Date.now() + 432000000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 518400000).toISOString().split('T')[0],
    reason: 'Extended vacation'
  };

  const applyResult = await apiCall('/leave', 'POST', leaveData, TOKENS.employee);
  
  if (applyResult.status === 201 && applyResult.data.success) {
    const leaveId = applyResult.data.leave.id;
    console.log('✅ Leave applied, ID:', leaveId);

    // Now reject it
    const rejectResult = await apiCall(
      `/leave/${leaveId}/status`,
      'PATCH',
      { 
        status: 'REJECTED',
        rejectionReason: 'Insufficient leave balance'
      },
      TOKENS.manager
    );

    if (rejectResult.status === 200 && rejectResult.data.success) {
      console.log('✅ Leave rejected successfully');
      console.log('📊 Status:', rejectResult.data.leave.status);
      console.log('💬 Message:', rejectResult.data.message);
    } else {
      console.log('❌ Leave rejection failed');
      console.log('Error:', rejectResult.data.error || rejectResult.error);
    }
  }
}

// Test 10: Test overlapping leave detection
async function testOverlappingLeaves() {
  console.log('\n🧪 Test 10: Overlapping Leave Detection');
  console.log('=======================================');

  const leaveData1 = {
    type: 'CASUAL',
    startDate: new Date(Date.now() + 604800000).toISOString().split('T')[0], // 7 days from now
    endDate: new Date(Date.now() + 691200000).toISOString().split('T')[0], // 8 days from now
    reason: 'First leave'
  };

  const result1 = await apiCall('/leave', 'POST', leaveData1, TOKENS.employee);
  
  if (result1.status === 201 && result1.data.success) {
    console.log('✅ First leave applied');

    // Try to apply overlapping leave
    const leaveData2 = {
      type: 'SICK',
      startDate: new Date(Date.now() + 604800000).toISOString().split('T')[0], // Same start date
      endDate: new Date(Date.now() + 777600000).toISOString().split('T')[0],
      reason: 'Overlapping leave'
    };

    const result2 = await apiCall('/leave', 'POST', leaveData2, TOKENS.employee);
    
    if (result2.status === 400) {
      console.log('✅ Correctly detected overlapping leave');
      console.log('💬 Error:', result2.data.error);
    } else {
      console.log('❌ Overlapping leave was allowed (validation issue!)');
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Leave Management System Tests');
  console.log('=========================================\n');

  console.log('⚠️  Note: Make sure to update TOKENS object with valid tokens');
  console.log('⚠️  Backend should be running on http://localhost:5004\n');

  try {
    // Test 1: Employee applies for leave
    const employeeLeaveId = await testEmployeeLeaveApplication();

    // Test 2: Manager gets approvable leaves
    await testManagerGetApprovableLeaves();

    // Test 3: Manager approves employee leave
    if (employeeLeaveId) {
      await testManagerApproveLeave(employeeLeaveId);
    }

    // Test 4: Manager applies for leave
    const managerLeaveId = await testManagerLeaveApplication();

    // Test 5: HR approves manager leave
    if (managerLeaveId) {
      await testHRApproveManagerLeave(managerLeaveId);
    }

    // Test 6: Get notifications for different roles
    await testGetNotifications(TOKENS.employee, 'Employee');
    await testGetNotifications(TOKENS.manager, 'Manager');

    // Test 7: Get statistics
    await testGetStatistics(TOKENS.employee, 'Employee');

    // Test 8: Permission checks
    if (employeeLeaveId) {
      await testPermissionChecks(employeeLeaveId);
    }

    // Test 9: Rejection with reason
    await testLeaveRejection();

    // Test 10: Overlapping leave detection
    await testOverlappingLeaves();

    console.log('\n✅ All tests completed!');
    console.log('=====================================\n');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
}

// Run tests
runAllTests();
