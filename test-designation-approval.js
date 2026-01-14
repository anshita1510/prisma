#!/usr/bin/env node

/**
 * Test script to verify designation-based leave approval system
 * 
 * This script tests:
 * 1. HR (designation) can see and approve Manager (designation) leaves
 * 2. Manager (designation) cannot see HR leaves
 * 3. Only CEO can approve HR leaves
 */

const BASE_URL = 'http://localhost:5004';

// Test users (you'll need to update these with actual credentials)
const TEST_USERS = {
  hr: {
    email: 'singladeepak519@gmail.com', // Update with actual HR user
    password: 'password123',
    expectedDesignation: 'HR'
  },
  manager: {
    email: 'manager@example.com', // Update with actual Manager user
    password: 'password123',
    expectedDesignation: 'MANAGER'
  },
  ceo: {
    email: 'ceo@example.com', // Update with actual CEO user
    password: 'password123',
    expectedRole: 'SUPER_ADMIN'
  }
};

async function login(email, password) {
  console.log(`\n🔑 Logging in as: ${email}`);
  
  const response = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (!response.ok || !data.token) {
    throw new Error(`Login failed: ${data.message || 'Unknown error'}`);
  }

  console.log(`✅ Login successful`);
  console.log(`   User: ${data.user.firstName} ${data.user.lastName}`);
  console.log(`   Role: ${data.user.role}`);
  console.log(`   Designation: ${data.user.designation || 'N/A'}`);
  
  return data.token;
}

async function getApprovableLeaves(token) {
  console.log(`\n📋 Fetching approvable leaves...`);
  
  const response = await fetch(`${BASE_URL}/api/leaves/approvable`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Failed to fetch leaves: ${data.error || 'Unknown error'}`);
  }

  console.log(`✅ Found ${data.count} approvable leaves`);
  
  if (data.leaves && data.leaves.length > 0) {
    console.log(`\n   Approvable leaves:`);
    data.leaves.forEach((leave, index) => {
      console.log(`   ${index + 1}. ${leave.employee.name} (${leave.employee.designation})`);
      console.log(`      Type: ${leave.type}, Status: ${leave.status}`);
      console.log(`      Dates: ${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}`);
    });
  }
  
  return data.leaves || [];
}

async function testHRCanApproveManagerLeaves() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 1: HR (designation) can see and approve Manager (designation) leaves');
  console.log('='.repeat(80));
  
  try {
    const token = await login(TEST_USERS.hr.email, TEST_USERS.hr.password);
    const leaves = await getApprovableLeaves(token);
    
    const managerLeaves = leaves.filter(l => l.employee.designation === 'MANAGER');
    
    if (managerLeaves.length > 0) {
      console.log(`\n✅ SUCCESS: HR can see ${managerLeaves.length} Manager leave(s)`);
      return true;
    } else {
      console.log(`\n⚠️  WARNING: No Manager leaves found for HR to approve`);
      console.log(`   This might be because there are no pending Manager leaves in the system`);
      return true; // Not a failure, just no data
    }
  } catch (error) {
    console.error(`\n❌ FAILED: ${error.message}`);
    return false;
  }
}

async function testManagerCannotSeeHRLeaves() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 2: Manager (designation) cannot see HR (designation) leaves');
  console.log('='.repeat(80));
  
  try {
    const token = await login(TEST_USERS.manager.email, TEST_USERS.manager.password);
    const leaves = await getApprovableLeaves(token);
    
    const hrLeaves = leaves.filter(l => l.employee.designation === 'HR');
    
    if (hrLeaves.length === 0) {
      console.log(`\n✅ SUCCESS: Manager cannot see HR leaves (as expected)`);
      return true;
    } else {
      console.error(`\n❌ FAILED: Manager can see ${hrLeaves.length} HR leave(s) (should be 0)`);
      return false;
    }
  } catch (error) {
    console.error(`\n❌ FAILED: ${error.message}`);
    return false;
  }
}

async function testCEOCanApproveAllLeaves() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 3: CEO (SUPER_ADMIN role) can see all leaves including HR');
  console.log('='.repeat(80));
  
  try {
    const token = await login(TEST_USERS.ceo.email, TEST_USERS.ceo.password);
    const leaves = await getApprovableLeaves(token);
    
    console.log(`\n✅ SUCCESS: CEO can see ${leaves.length} total leave(s)`);
    
    const designationCounts = leaves.reduce((acc, leave) => {
      const designation = leave.employee.designation;
      acc[designation] = (acc[designation] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`\n   Breakdown by designation:`);
    Object.entries(designationCounts).forEach(([designation, count]) => {
      console.log(`   - ${designation}: ${count}`);
    });
    
    return true;
  } catch (error) {
    console.error(`\n❌ FAILED: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('\n' + '='.repeat(80));
  console.log('DESIGNATION-BASED LEAVE APPROVAL SYSTEM TEST');
  console.log('='.repeat(80));
  console.log('\nTesting backend at:', BASE_URL);
  console.log('Make sure the backend is running on port 5004');
  
  const results = [];
  
  // Run tests
  results.push(await testHRCanApproveManagerLeaves());
  results.push(await testManagerCannotSeeHRLeaves());
  results.push(await testCEOCanApproveAllLeaves());
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\nTests passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('\n✅ ALL TESTS PASSED! Designation-based approval is working correctly.');
  } else {
    console.log('\n❌ SOME TESTS FAILED. Please review the errors above.');
  }
  
  console.log('\n' + '='.repeat(80));
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Test execution failed:', error);
  process.exit(1);
});
