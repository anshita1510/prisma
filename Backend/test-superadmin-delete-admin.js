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

async function testSuperAdminDeleteAdmin() {
  try {
    console.log("🧪 Testing SuperAdmin Delete Admin Permission...");

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

    // Create a test admin user to delete
    console.log("2. Creating a test admin user...");
    const createAdminResponse = await makeRequest(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test-admin-to-delete@example.com",
        firstName: "Test",
        lastName: "Admin",
        phone: "+1234567890",
        designation: "Test Administrator",
        role: "ADMIN",
        companyName: "Test Company",
        companyId: "TEST123"
      }),
    });

    const createAdminData = createAdminResponse.json();
    
    if (!createAdminResponse.ok) {
      console.error("❌ Create admin failed:", createAdminData);
      return;
    }

    console.log("✅ Test admin created successfully");
    const testAdminId = createAdminData.user ? createAdminData.user.id : createAdminData.id;

    // Now test delete admin as super admin
    console.log(`3. SuperAdmin attempting to delete admin (ID: ${testAdminId})`);
    const deleteResponse = await makeRequest(`${API_URL}/api/users/${testAdminId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const deleteData = deleteResponse.json();
    
    if (!deleteResponse.ok) {
      console.error("❌ Delete admin failed:", deleteData);
      console.error("Response status:", deleteResponse.status);
      return;
    }

    console.log("✅ Admin deleted successfully by SuperAdmin:", deleteData);

    // Verify admin is deleted
    console.log("4. Verifying admin is deleted...");
    const verifyResponse = await makeRequest(`${API_URL}/api/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = verifyResponse.json();
    const deletedAdminStillExists = verifyData.users.find(user => user.id === testAdminId);

    if (deletedAdminStillExists) {
      console.error("❌ Admin still exists after deletion!");
    } else {
      console.log("✅ Admin successfully removed from database");
    }

    console.log("🎉 Test passed! SuperAdmin can successfully delete Admin users.");

  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

testSuperAdminDeleteAdmin();