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
          resolve({ 
            ok: res.statusCode >= 200 && res.statusCode < 300, 
            status: res.statusCode, 
            json: () => jsonData,
            headers: res.headers
          });
        } catch (e) {
          resolve({ 
            ok: res.statusCode >= 200 && res.statusCode < 300, 
            status: res.statusCode, 
            text: () => data,
            headers: res.headers
          });
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

async function testDeleteWithCookies() {
  try {
    console.log("🧪 Testing Delete with Cookies (like frontend)...");

    // Login as super admin and get cookie
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
    
    // Extract cookie from response headers
    const setCookieHeader = loginResponse.headers['set-cookie'];
    console.log("Set-Cookie headers:", setCookieHeader);
    
    let authCookie = '';
    if (setCookieHeader) {
      // Find the auth_token cookie
      const authCookieMatch = setCookieHeader.find(cookie => cookie.includes('auth_token='));
      if (authCookieMatch) {
        authCookie = authCookieMatch.split(';')[0]; // Get just the cookie value part
        console.log("Auth cookie:", authCookie);
      }
    }

    // If no cookie, use token from response
    const token = loginData.token;
    console.log("Token from response:", token ? "Present" : "Missing");

    // Try to delete admin user with ID 3 using cookie
    const adminIdToDelete = 3;
    console.log(`2. Attempting to delete admin user (ID: ${adminIdToDelete}) using cookie...`);
    
    const deleteResponse = await makeRequest(`${API_URL}/api/users/${adminIdToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie || `auth_token=${token}` // Use cookie or fallback to token
      },
    });

    const deleteData = deleteResponse.json();
    
    console.log("Delete response status:", deleteResponse.status);
    console.log("Delete response data:", deleteData);
    
    if (!deleteResponse.ok) {
      console.error("❌ Delete admin failed with cookie, trying with Authorization header...");
      
      // Try with Authorization header as fallback
      const deleteResponse2 = await makeRequest(`${API_URL}/api/users/${adminIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const deleteData2 = deleteResponse2.json();
      
      console.log("Delete response status (with auth header):", deleteResponse2.status);
      console.log("Delete response data (with auth header):", deleteData2);
      
      if (!deleteResponse2.ok) {
        console.error("❌ Delete admin failed with both methods:", deleteData2);
        return;
      }
      
      console.log("✅ Admin user deleted successfully with Authorization header:", deleteData2);
    } else {
      console.log("✅ Admin user deleted successfully with cookie:", deleteData);
    }

  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

testDeleteWithCookies();