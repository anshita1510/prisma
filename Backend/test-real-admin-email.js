// Test creating admin with YOUR email to verify email delivery
const axios = require('axios');
const readline = require('readline');

const BASE_URL = 'http://localhost:5004';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testRealEmail() {
  try {
    console.log('\n🧪 TESTING ADMIN CREATION WITH YOUR EMAIL');
    console.log('=====================================\n');

    // Get email from user
    rl.question('Enter the email address where you want to receive the invitation: ', async (email) => {
      try {
        // Step 1: Login as super admin
        console.log('\n1️⃣ Logging in as Super Admin...');
        const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, {
          email: 'singladeepak519@gmail.com',
          password: 'password123'
        });

        const token = loginResponse.data.token;
        console.log('   ✅ Login successful\n');

        // Step 2: Create admin
        console.log('2️⃣ Creating admin with email:', email);
        
        const createResponse = await axios.post(
          `${BASE_URL}/api/users/register`,
          {
            email: email,
            firstName: 'Test',
            lastName: 'User',
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
        console.log('   Response:', createResponse.data);
        console.log('\n=====================================');
        console.log('📧 EMAIL SENT TO:', email);
        console.log('=====================================');
        console.log('\n💡 NEXT STEPS:');
        console.log('   1. Check your email inbox (including spam/junk folder)');
        console.log('   2. Look for email from: s.deepak@signitysolutions.com');
        console.log('   3. Subject: "Welcome to Tikr - Your Account is Ready!"');
        console.log('   4. Email contains: OTP and Temporary Password');
        console.log('\n📋 CHECK BACKEND LOGS ABOVE FOR:');
        console.log('   - OTP: [6-digit number]');
        console.log('   - Temp Password: [12-character hex]');
        console.log('=====================================\n');

      } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
      } finally {
        rl.close();
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
  }
}

testRealEmail();
