const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

async function testAttendanceSystem() {
  try {
    console.log('🔍 Testing attendance system...');
    
    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, {
      email: 'admin@tikr.com',
      password: 'Admin@123'
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data);
      return;
    }
    
    const { token, user } = loginResponse.data;
    console.log('✅ Login successful');
    console.log('👤 User:', user);
    console.log('🆔 Employee ID:', user.employeeId);
    
    if (!user.employeeId) {
      console.log('❌ User does not have employeeId - this is the issue!');
      return;
    }
    
    // Set up axios with auth token
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Test check-in
    console.log('2. Testing check-in...');
    const checkinResponse = await api.post('/api/attendance/checkin', {
      employeeId: user.employeeId,
      deviceType: 'web'
    });
    
    console.log('✅ Check-in successful:', checkinResponse.data);
    
    // Get today's attendance
    console.log('3. Getting today\'s attendance...');
    const today = new Date().toISOString().split('T')[0];
    const attendanceResponse = await api.get(`/api/attendance/personal/${user.employeeId}?startDate=${today}&endDate=${today}`);
    
    console.log('✅ Today\'s attendance:', attendanceResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAttendanceSystem();