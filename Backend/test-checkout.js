const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

async function testCheckout() {
  try {
    console.log('🔍 Testing check-out...');
    
    // Login
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, {
      email: 'admin@tikr.com',
      password: 'Admin@123'
    });
    
    const { token, user } = loginResponse.data;
    console.log('✅ Login successful, Employee ID:', user.employeeId);
    
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Test check-out
    console.log('2. Testing check-out...');
    const checkoutResponse = await api.post('/api/attendance/checkout', {
      employeeId: user.employeeId,
      deviceType: 'web'
    });
    
    console.log('✅ Check-out successful:', checkoutResponse.data);
    
    // Get today's attendance after checkout
    console.log('3. Getting attendance after checkout...');
    const today = new Date().toISOString().split('T')[0];
    const attendanceResponse = await api.get(`/api/attendance/personal/${user.employeeId}?startDate=${today}&endDate=${today}`);
    
    console.log('✅ Final attendance record:', attendanceResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testCheckout();