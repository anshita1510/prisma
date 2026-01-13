// Test script to verify leave management API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5004';

// Test credentials
const ADMIN_EMAIL = 'singladeepak519@gmail.com';
const ADMIN_PASSWORD = 'password123';

async function testLeaveAPI() {
  console.log('🧪 Testing Leave Management API...\n');
  
  try {
    // Step 1: Login as admin
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok || !loginData.token) {
      console.error('❌ Login failed:', loginData);
      return;
    }
    
    console.log('✅ Login successful');
    const token = loginData.token;
    
    // Step 2: Get all leaves
    console.log('\n2️⃣ Fetching all leaves...');
    const leavesResponse = await fetch(`${BASE_URL}/api/leaves`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const leavesData = await leavesResponse.json();
    
    if (!leavesResponse.ok) {
      console.error('❌ Failed to fetch leaves:', leavesData);
      return;
    }
    
    console.log('✅ Leaves fetched successfully');
    console.log(`📊 Total leaves: ${leavesData.count || 0}`);
    
    if (leavesData.leaves && leavesData.leaves.length > 0) {
      console.log('\n📋 Leave Applications:');
      leavesData.leaves.forEach((leave, index) => {
        console.log(`${index + 1}. ID: ${leave.id}, Status: ${leave.status}, Employee: ${leave.employee?.name || 'Unknown'}, Type: ${leave.type}`);
      });
      
      // Step 3: Test approve/reject on first pending leave
      const pendingLeave = leavesData.leaves.find(leave => leave.status === 'PENDING');
      
      if (pendingLeave) {
        console.log(`\n3️⃣ Testing approve functionality on leave ID: ${pendingLeave.id}`);
        
        const approveResponse = await fetch(`${BASE_URL}/api/leaves/${pendingLeave.id}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'APPROVED' })
        });
        
        const approveData = await approveResponse.json();
        
        if (approveResponse.ok) {
          console.log('✅ Leave approved successfully');
          console.log(`📝 Approved by: ${approveData.leave?.approvedBy || 'Unknown'}`);
        } else {
          console.error('❌ Failed to approve leave:', approveData);
        }
      } else {
        console.log('ℹ️ No pending leaves found to test approve functionality');
      }
    } else {
      console.log('ℹ️ No leaves found in the system');
    }
    
    console.log('\n🎉 API test completed!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

// Run the test
testLeaveAPI();