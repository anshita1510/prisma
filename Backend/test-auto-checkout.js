const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

async function testAutoCheckout() {
  try {
    console.log('🔍 Testing auto-checkout functionality...');
    
    // Login as admin
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
    
    // Check current attendance status
    console.log('1. Checking current attendance status...');
    const today = new Date().toISOString().split('T')[0];
    const currentAttendance = await api.get(`/api/attendance/personal/${user.employeeId}?startDate=${today}&endDate=${today}`);
    console.log('Current attendance:', currentAttendance.data);
    
    // Trigger manual auto-checkout (admin only)
    console.log('2. Triggering manual auto-checkout...');
    const autoCheckoutResponse = await api.post('/api/attendance/auto-checkout/trigger');
    
    console.log('✅ Auto-checkout triggered:', autoCheckoutResponse.data);
    
    // Get attendance after auto-checkout
    console.log('3. Getting attendance after auto-checkout...');
    const attendanceResponse = await api.get(`/api/attendance/personal/${user.employeeId}?startDate=${today}&endDate=${today}`);
    
    console.log('✅ Attendance after auto-checkout:', attendanceResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAutoCheckout();