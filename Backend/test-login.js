const axios = require('axios');

async function testLogin() {
  const credentials = [
    { email: 'admin@tikr.com', password: 'Admin@123' },
    { email: 'admin@tikr.com', password: 'admin123' },
    { email: 'admin@tikr.com', password: 'password' },
    { email: 'admin@tikr.com', password: 'admin' },
    { email: 'super@admin.com', password: 'Admin@123' },
    { email: 'superadmin@tikr.com', password: 'Admin@123' }
  ];

  for (const cred of credentials) {
    try {
      console.log(`Testing login with ${cred.email} / ${cred.password}`);
      
      const response = await axios.post('http://localhost:5004/api/users/login', cred);
      
      console.log('✅ Login successful!');
      console.log('User:', response.data.user);
      console.log('Token:', response.data.token);
      
      // Test the register endpoint with this token
      await testRegisterEndpoint(response.data.token);
      
      return; // Exit on first successful login
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ Failed: ${error.response.data.error || error.response.data.message}`);
      } else {
        console.log(`❌ Network error: ${error.message}`);
      }
    }
  }
  
  console.log('❌ All login attempts failed');
}

async function testRegisterEndpoint(token) {
  try {
    console.log('\n=== Testing Register Endpoint ===');
    
    const testUserData = {
      email: `test${Date.now()}@example.com`, // Use unique email
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      designation: 'SOFTWARE_ENGINEER',
      role: 'EMPLOYEE',
      employeeCode: `TEST${Date.now()}`
    };
    
    const response = await axios.post('http://localhost:5004/api/users/register', testUserData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Register endpoint successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Register failed:', error.response.data);
      console.log('Status:', error.response.status);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testLogin();