// Test script to create admin and debug email sending
const axios = require('axios');

const BASE_URL = 'http://localhost:5004';

async function testEmailSending() {
  try {
    console.log('\n🧪 TESTING EMAIL SENDING FOR ADMIN CREATION');
    console.log('=====================================\n');

    // Step 1: Login as super admin
    console.log('1️⃣ Logging in as Super Admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, {
      email: 'singladeepak519@gmail.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('   ✅ Login successful\n');

    // Step 2: Create new admin with unique email
    const testEmail = `test_${Date.now()}@mailinator.com`;
    console.log('2️⃣ Creating new admin...');
    console.log('   Email:', testEmail);
    
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

    console.log('   ✅ Admin created!');
    console.log('   Response:', createResponse.data);
    console.log('\n=====================================');
    console.log('📧 NOW CHECK BACKEND LOGS FOR:');
    console.log('   - "🔐 GENERATED CREDENTIALS FOR:"');
    console.log('   - "📧 Attempting to send email to:"');
    console.log('   - "✅ Email sent successfully" OR');
    console.log('   - "❌ Email sending failed"');
    console.log('=====================================\n');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('   Token expired or invalid. Try logging in again.');
    }
  }
}

testEmailSending();
