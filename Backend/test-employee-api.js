const axios = require('axios');

const API_URL = 'http://localhost:5004';

// Test token - you'll need a valid token from login
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImVtYWlsIjoiYWRtaW5Aa2VrYS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MzY4MzI0NzcsImV4cCI6MTczNjkxODg3N30.Yd0Yd0Yd0Yd0Yd0Yd0Yd0Yd0Yd0Yd0Yd0Yd0Yd0'; // Replace with actual token

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${testToken}`,
    'Content-Type': 'application/json'
  }
});

async function testEmployeeAPI() {
  try {
    console.log('🧪 Testing Employee API...\n');

    // Test 1: Get all employees
    console.log('📋 Test 1: Get all employees');
    try {
      const response = await api.get('/api/employees');
      console.log('✅ Success:', response.status);
      console.log('📊 Employees found:', response.data.data?.length || 0);
      console.log('Response:', JSON.stringify(response.data, null, 2).substring(0, 500));
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.message);
    }

    console.log('\n---\n');

    // Test 2: Create new employee
    console.log('📋 Test 2: Create new employee');
    try {
      const newEmployee = {
        name: 'Test Employee ' + Date.now(),
        email: `test-${Date.now()}@example.com`,
        phone: '9876543210',
        designation: 'SOFTWARE_ENGINEER',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        location: 'Test City'
      };

      console.log('📤 Payload:', JSON.stringify(newEmployee, null, 2));

      const response = await api.post('/api/employees', newEmployee);
      console.log('✅ Success:', response.status);
      console.log('📊 Created employee:', response.data.data?.name);
      console.log('Response:', JSON.stringify(response.data, null, 2).substring(0, 500));
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.message);
      console.log('Full error:', error.response?.data);
    }

    console.log('\n---\n');

    // Test 3: Get employees by company
    console.log('📋 Test 3: Get employees by company');
    try {
      const response = await api.get('/api/employees?companyId=1');
      console.log('✅ Success:', response.status);
      console.log('📊 Employees found:', response.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data?.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEmployeeAPI();
