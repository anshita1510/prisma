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

async function testDeleteAdminUser() {
  try {
    console.log("🧪 Testing Delete Admin User...");

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

    // Try to delete admin user with ID 4 (deepak@mailinator.com)
    const adminIdToDelete = 4;
    console.log(`2. Attempting to delete admin user (ID: ${adminIdToDelete})...`);
    
    const deleteResponse = await makeRequest(`${API_URL}/api/users/${adminIdToDelete}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const deleteData = deleteResponse.json();
    
    console.log("Delete response status:", deleteResponse.status);
    console.log("Delete response data:", deleteData);
    
    if (!deleteResponse.ok) {
      console.error("❌ Delete admin failed:", deleteData);
      return;
    }

    console.log("✅ Admin user deleted successfully:", deleteData);

    // Verify deletion
    console.log("3. Verifying deletion...");
    const verifyResponse = await makeRequest(`${API_URL}/api/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = verifyResponse.json();
    const deletedUserStillExists = verifyData.users.find(user => user.id === adminIdToDelete);

    if (deletedUserStillExists) {
      console.error("❌ Admin user still exists after deletion!");
    } else {
      console.log("✅ Admin user successfully removed from database");
    }

  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

testDeleteAdminUser();