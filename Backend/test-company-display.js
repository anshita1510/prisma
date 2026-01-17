const https = require('https');
const http = require('http');

const API_URL = "http://localhost:5004";

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, json: () => jsonData });
        } catch (e) {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, text: () => data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testCompanyDisplay() {
  try {
    console.log("🧪 Testing Company Information Display...");

    // Login as super admin
    console.log("1. Logging in as super admin...");
    const loginResponse = await makeRequest(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "anshitabharwal@gmail.com",
        password: "admin123"
      }),
    });

    const loginData = loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error("❌ Login failed:", loginData);
      return;
    }

    console.log("✅ Login successful");
    const token = loginData.token;

    // Create a test user with company information
    console.log("2. Creating a test user with company information...");
    const createUserResponse = await makeRequest(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test-company-user@example.com",
        firstName: "Test",
        lastName: "CompanyUser",
        phone: "+1234567890",
        designation: "Software Engineer",
        role: "EMPLOYEE",
        companyName: "Test Company Inc",
        companyId: "TESTCO123"
      }),
    });

    const createUserData = createUserResponse.json();
    
    if (!createUserResponse.ok) {
      console.error("❌ Create user failed:", createUserData);
      return;
    }

    console.log("✅ Test user created successfully");

    // Get all users to check if company information is displayed
    console.log("3. Getting all users to check company information...");
    const usersResponse = await makeRequest(`${API_URL}/api/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const usersData = usersResponse.json();
    
    if (!usersResponse.ok) {
      console.error("❌ Get users failed:", usersData);
      return;
    }

    console.log("✅ Users retrieved successfully");
    console.log("Users with company information:");
    
    usersData.users.forEach(user => {
      console.log(`- ${user.email}:`);
      console.log(`  Company Name: ${user.companyName || 'N/A'}`);
      console.log(`  Company ID: ${user.companyId || 'N/A'}`);
      console.log(`  Role: ${user.role}`);
      console.log('---');
    });

    // Check if our test user has company information
    const testUser = usersData.users.find(user => user.email === 'test-company-user@example.com');
    if (testUser) {
      if (testUser.companyName && testUser.companyId) {
        console.log("🎉 SUCCESS: Company information is being displayed correctly!");
        console.log(`Test user company: ${testUser.companyName} (${testUser.companyId})`);
      } else {
        console.log("❌ ISSUE: Company information is still showing as N/A");
        console.log("Test user data:", testUser);
      }
    } else {
      console.log("❌ Test user not found in the list");
    }

  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

testCompanyDisplay();