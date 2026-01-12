const axios = require('axios');

async function testRegister() {
  try {
    // First login to get a fresh token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post('http://localhost:5004/api/users/login', {
      email: 'admin@tikr.com',
      password: 'Admin@123'
    });
    
    console.log('✅ Login successful!');
    const token = loginResponse.data.token;
    console.log('Token:', token.substring(0, 50) + '...');
    
    // Now test register
    console.log('\n👤 Creating new user...');
    const userData = {
      email: `testuser${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      designation: 'SOFTWARE_ENGINEER',
      role: 'EMPLOYEE',
      employeeCode: `TEST${Date.now()}`
    };
    
    console.log('User data:', userData);
    
    const registerResponse = await axios.post('http://localhost:5004/api/users/register', userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ User created successfully!');
    console.log('Response:', registerResponse.data);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data);
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testRegister();