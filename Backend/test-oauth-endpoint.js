/**
 * Test script to verify OAuth endpoints are accessible
 * Run with: node test-oauth-endpoint.js
 */

const http = require('http');

const testEndpoint = (path, description) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5004,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Test-Script'
      }
    };

    console.log(`\n🧪 Testing: ${description}`);
    console.log(`   URL: http://localhost:5004${path}`);

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        
        if (res.statusCode === 302) {
          console.log(`   ✅ Redirect to: ${res.headers.location}`);
          resolve({ success: true, redirect: res.headers.location });
        } else if (res.statusCode === 200) {
          console.log(`   ✅ Success`);
          try {
            const json = JSON.parse(data);
            console.log(`   Response:`, json);
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
          resolve({ success: true, data });
        } else {
          console.log(`   ❌ Unexpected status code`);
          resolve({ success: false, status: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
      reject(error);
    });

    req.end();
  });
};

async function runTests() {
  console.log('='.repeat(60));
  console.log('🔐 Google OAuth Endpoint Tests');
  console.log('='.repeat(60));

  try {
    // Test 1: Health check
    await testEndpoint('/health', 'Health Check');

    // Test 2: OAuth test endpoint
    await testEndpoint('/api/auth/test', 'OAuth Routes Test Endpoint');

    // Test 3: Google OAuth initiation (should redirect to Google)
    const result = await testEndpoint('/api/auth/google', 'Google OAuth Initiation');
    
    if (result.redirect) {
      const url = new URL(result.redirect);
      console.log('\n📋 OAuth URL Analysis:');
      console.log(`   Domain: ${url.hostname}`);
      console.log(`   Client ID: ${url.searchParams.get('client_id')?.substring(0, 20)}...`);
      console.log(`   Redirect URI: ${url.searchParams.get('redirect_uri')}`);
      console.log(`   Scope: ${url.searchParams.get('scope')}`);
      
      const redirectUri = url.searchParams.get('redirect_uri');
      if (redirectUri === 'http://localhost:5004/api/auth/google/callback') {
        console.log('\n✅ REDIRECT URI IS CORRECT!');
      } else {
        console.log('\n❌ REDIRECT URI IS WRONG!');
        console.log(`   Expected: http://localhost:5004/api/auth/google/callback`);
        console.log(`   Got: ${redirectUri}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running:');
    console.log('   cd Backend && npm run dev');
  }
}

runTests();
