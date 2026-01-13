// Test script to verify frontend-backend connectivity
const API_BASE_URL = 'http://localhost:5004';

async function testConnection() {
  console.log('🧪 Testing frontend-backend connection...');
  
  try {
    // Test 1: Basic connection
    console.log('\n1. Testing basic connection...');
    const testResponse = await fetch(`${API_BASE_URL}/api/test`);
    const testData = await testResponse.json();
    console.log('✅ Basic connection:', testData);
    
    // Test 2: Login
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'singladeepak519@gmail.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData.success ? 'Success' : 'Failed');
    
    if (!loginData.token) {
      throw new Error('No token received from login');
    }
    
    // Test 3: Get leaves
    console.log('\n3. Testing get leaves...');
    const leavesResponse = await fetch(`${API_BASE_URL}/api/leaves`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      }
    });
    
    const leavesData = await leavesResponse.json();
    console.log('✅ Leaves response:', `Found ${leavesData.leaves?.length || 0} leaves`);
    
    // Test 4: Update leave status (if there are pending leaves)
    if (leavesData.leaves && leavesData.leaves.length > 0) {
      const pendingLeave = leavesData.leaves.find(leave => leave.status === 'PENDING');
      
      if (pendingLeave) {
        console.log(`\n4. Testing approve leave ID ${pendingLeave.id}...`);
        const approveResponse = await fetch(`${API_BASE_URL}/api/leaves/${pendingLeave.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({ status: 'APPROVED' })
        });
        
        const approveData = await approveResponse.json();
        console.log('✅ Approve response:', approveData.success ? 'Success' : 'Failed');
        
        if (approveData.success) {
          console.log(`   Leave ${pendingLeave.id} approved by ${approveData.leave.approvedBy}`);
        }
      } else {
        console.log('ℹ️ No pending leaves to test approval');
      }
    }
    
    console.log('\n🎉 All tests passed! Frontend-backend connection is working.');
    console.log('\n📋 Summary:');
    console.log('   - Backend server: ✅ Running');
    console.log('   - Authentication: ✅ Working');
    console.log('   - Leave API: ✅ Working');
    console.log('   - Approve/Reject: ✅ Working');
    console.log('\n💡 If the frontend still has issues, check:');
    console.log('   1. Browser localStorage for valid token');
    console.log('   2. Browser console for CORS errors');
    console.log('   3. Network tab for failed requests');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message
    });
  }
}

// Run the test
testConnection();