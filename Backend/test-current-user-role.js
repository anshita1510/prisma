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

async function testCurrentUserRole() {
  try {
    console.log("🧪 Testing Current User Role...");

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
    console.log("Login data:", loginData);
    const token = loginData.token;

    // Get current user info
    console.log("2. Getting current user info...");
    const meResponse = await makeRequest(`${API_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const meData = meResponse.json();
    
    if (!meResponse.ok) {
      console.error("❌ Get current user failed:", meData);
      return;
    }

    console.log("✅ Current user info:");
    console.log("User:", meData.user);
    console.log("Role:", meData.user.role);
    console.log("ID:", meData.user.id);

    // Get all users to see what we can access
    console.log("3. Getting all users...");
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

    console.log("✅ Users accessible:");
    usersData.users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ID: ${user.id}`);
    });

  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

testCurrentUserRole();