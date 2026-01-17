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

async function testDeleteUser() {
  try {
    console.log("🧪 Testing Delete User API...");

    // First, login as super admin to get token
    console.log("1. Logging in as super admin...");
    const loginResponse = await makeRequest(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "anshitabharwal@gmail.com",
        password: "123456"
      }),
    });

    const loginData = loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error("❌ Login failed:", loginData);
      return;
    }

    console.log("✅ Login successful");
    const token = loginData.token;

    // Get all users to find one to delete
    console.log("2. Getting all users...");
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

    console.log(`✅ Found ${usersData.users.length} users`);
    
    // Find a user that's not the super admin
    const userToDelete = usersData.users.find(user => 
      user.role !== 'SUPER_ADMIN' && user.email !== 'anshitabharwal@gmail.com'
    );

    if (!userToDelete) {
      console.log("⚠️ No suitable user found to delete (need a non-super-admin user)");
      return;
    }

    console.log(`3. Attempting to delete user: ${userToDelete.email} (ID: ${userToDelete.id})`);

    // Test delete user
    const deleteResponse = await makeRequest(`${API_URL}/api/users/${userToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const deleteData = deleteResponse.json();
    
    if (!deleteResponse.ok) {
      console.error("❌ Delete user failed:", deleteData);
      console.error("Response status:", deleteResponse.status);
      return;
    }

    console.log("✅ User deleted successfully:", deleteData);

    // Verify user is deleted by trying to get users again
    console.log("4. Verifying user is deleted...");
    const verifyResponse = await makeRequest(`${API_URL}/api/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = verifyResponse.json();
    const deletedUserStillExists = verifyData.users.find(user => user.id === userToDelete.id);

    if (deletedUserStillExists) {
      console.error("❌ User still exists after deletion!");
    } else {
      console.log("✅ User successfully removed from database");
    }

  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

testDeleteUser();