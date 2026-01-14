// Test script to create admin and verify OTP is sent in email
const axios = require('axios');

const BASE_URL = 'http://localhost:5004';

async function testCreateAdmin() {
  try {
    console.log('\n🧪 TESTING ADMIN CREATION WITH OTP FIX');
    console.log('=====================================\n');

    // Step 1: Login as super admin
    console.log('1️⃣ Logging in as Super Admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, {
      email: 'singladeepak519@gmail.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('   ✅ Login successful');
    console.log('   Token:', token.substring(0, 20) + '...\n');

    // Step 2: Create new admin
    console.log('2️⃣ Creating new admin...');
    const testEmail = `test_${Date.now()}@mailinator.com`;
    
    const createResponse = await axios.post(
      `${BASE_URL}/api/users/register`,
      {
        email: testEmail,
        firstName: 'Test',
        lastName: 'Admin',
        phone: '+1234567890',
        designation: 'Administrator',
        role: 'ADMIN'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('   ✅ Admin created successfully!');
    console.log('   Email:', testEmail);
    console.log('   Response:', createResponse.data.message);
    console.log('\n=====================================');
    console.log('📧 CHECK BACKEND LOGS ABOVE FOR:');
    console.log('   🔐 GENERATED CREDENTIALS FOR:', testEmail);
    console.log('   OTP: [6-digit number]');
    console.log('   Temp Password: [12-character hex]');
    console.log('=====================================\n');

    console.log('💡 NEXT STEPS:');
    console.log('   1. Check the backend logs above for OTP and temp password');
    console.log('   2. Check your email inbox for the invitation email');
    console.log('   3. Verify the email contains BOTH OTP and temp password');
    console.log('   4. Use those credentials with /api/users/set-password endpoint\n');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCreateAdmin();
