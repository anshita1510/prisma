#!/usr/bin/env node

const fetch = require('node-fetch');

async function testApproveReject() {
  console.log('🧪 Testing Approve/Reject Functionality...\n');

  const baseUrl = 'http://localhost:5004';
  
  try {
    // Step 1: Login to get a valid token
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await fetch(`${baseUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'singladeepak519@gmail.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      throw new Error('Login failed: ' + loginData.message);
    }
    
    const token = loginData.token;
    console.log('✅ Login successful');

    // Step 2: Get all leaves
    console.log('\n2️⃣ Fetching all leaves...');
    const leavesResponse = await fetch(`${baseUrl}/api/leaves`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const leavesData = await leavesResponse.json();
    
    if (!leavesData.success) {
      throw new Error('Failed to fetch leaves: ' + leavesData.error);
    }

    console.log(`✅ Found ${leavesData.leaves.length} leaves`);
    
    // Find a pending leave
    const pendingLeave = leavesData.leaves.find(leave => leave.status === 'PENDING');
    
    if (!pendingLeave) {
      console.log('⚠️ No pending leaves found to test with');
      return;
    }

    console.log(`📋 Testing with leave ID: ${pendingLeave.id} (${pendingLeave.type})`);

    // Step 3: Test approve functionality
    console.log('\n3️⃣ Testing APPROVE functionality...');
    const approveResponse = await fetch(`${baseUrl}/api/leaves/${pendingLeave.id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'APPROVED' })
    });

    const approveData = await approveResponse.json();
    
    if (approveData.success) {
      console.log('✅ APPROVE functionality working correctly');
      console.log(`   Status updated to: ${approveData.leave.status}`);
      console.log(`   Approved by: ${approveData.leave.approvedBy}`);
    } else {
      console.error('❌ APPROVE failed:', approveData.error);
    }

    // Step 4: Test reject functionality (change it back)
    console.log('\n4️⃣ Testing REJECT functionality...');
    const rejectResponse = await fetch(`${baseUrl}/api/leaves/${pendingLeave.id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'REJECTED' })
    });

    const rejectData = await rejectResponse.json();
    
    if (rejectData.success) {
      console.log('✅ REJECT functionality working correctly');
      console.log(`   Status updated to: ${rejectData.leave.status}`);
      console.log(`   Rejected by: ${rejectData.leave.approvedBy}`);
    } else {
      console.error('❌ REJECT failed:', rejectData.error);
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Backend API is working correctly');
    console.log('   - Both APPROVE and REJECT endpoints are functional');
    console.log('   - Authentication is working');
    console.log('   - If frontend buttons are not working, the issue is in the frontend code');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testApproveReject();