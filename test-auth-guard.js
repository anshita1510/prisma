/**
 * Authentication Guard Test Script
 * Tests the authentication and authorization system
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';

// Test credentials for different roles
const testUsers = {
  superAdmin: {
    email: 'superadmin@example.com',
    password: 'password123'
  },
  admin: {
    email: 'admin@example.com',
    password: 'password123'
  },
  manager: {
    email: 'manager@example.com',
    password: 'password123'
  },
  employee: {
    email: 'employee@example.com',
    password: 'password123'
  }
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logSection(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${message}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');
}

// Test 1: Login with different roles
async function testLogin() {
  logSection('TEST 1: Login Authentication');
  
  for (const [role, credentials] of Object.entries(testUsers)) {
    try {
      logInfo(`Testing login for ${role}...`);
      
      const response = await axios.post(`${API_URL}/api/users/login`, credentials);
      
      if (response.data.token && response.data.user) {
        logSuccess(`${role} login successful`);
        logInfo(`  Token: ${response.data.token.substring(0, 20)}...`);
        logInfo(`  Role: ${response.data.user.role}`);
        
        // Store token for later tests
        testUsers[role].token = response.data.token;
        testUsers[role].userData = response.data.user;
      } else {
        logError(`${role} login failed - Invalid response format`);
      }
    } catch (error) {
      logError(`${role} login failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Test 2: Access protected endpoint with valid token
async function testProtectedEndpoint() {
  logSection('TEST 2: Protected Endpoint Access');
  
  for (const [role, data] of Object.entries(testUsers)) {
    if (!data.token) {
      logWarning(`Skipping ${role} - no token available`);
      continue;
    }
    
    try {
      logInfo(`Testing protected endpoint for ${role}...`);
      
      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      if (response.data.success && response.data.user) {
        logSuccess(`${role} can access protected endpoint`);
        logInfo(`  User ID: ${response.data.user.id}`);
        logInfo(`  Email: ${response.data.user.email}`);
      } else {
        logError(`${role} access failed - Invalid response`);
      }
    } catch (error) {
      logError(`${role} access failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Test 3: Access without token (should fail)
async function testNoToken() {
  logSection('TEST 3: Access Without Token');
  
  try {
    logInfo('Attempting to access protected endpoint without token...');
    
    await axios.get(`${API_URL}/api/users/me`);
    
    logError('Access granted without token - SECURITY ISSUE!');
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Access denied without token (as expected)');
      logInfo(`  Error code: ${error.response.data.code}`);
      logInfo(`  Message: ${error.response.data.message}`);
    } else {
      logError(`Unexpected error: ${error.message}`);
    }
  }
}

// Test 4: Access with invalid token (should fail)
async function testInvalidToken() {
  logSection('TEST 4: Access With Invalid Token');
  
  try {
    logInfo('Attempting to access with invalid token...');
    
    await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        'Authorization': 'Bearer invalid_token_12345'
      }
    });
    
    logError('Access granted with invalid token - SECURITY ISSUE!');
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Access denied with invalid token (as expected)');
      logInfo(`  Error code: ${error.response.data.code}`);
      logInfo(`  Message: ${error.response.data.message}`);
    } else {
      logError(`Unexpected error: ${error.message}`);
    }
  }
}

// Test 5: Role-based access control
async function testRoleBasedAccess() {
  logSection('TEST 5: Role-Based Access Control');
  
  // Test admin-only endpoint (if exists)
  logInfo('Testing role-based access...');
  
  // Example: Try to access admin endpoint with employee token
  if (testUsers.employee.token) {
    try {
      logInfo('Employee attempting to access admin endpoint...');
      
      // Replace with actual admin-only endpoint
      await axios.get(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${testUsers.employee.token}`
        }
      });
      
      logError('Employee accessed admin endpoint - AUTHORIZATION ISSUE!');
    } catch (error) {
      if (error.response?.status === 403) {
        logSuccess('Employee denied access to admin endpoint (as expected)');
        logInfo(`  Error code: ${error.response.data.code}`);
      } else if (error.response?.status === 404) {
        logWarning('Admin endpoint not found - skipping test');
      } else {
        logError(`Unexpected error: ${error.message}`);
      }
    }
  }
  
  // Test admin accessing admin endpoint
  if (testUsers.admin.token) {
    try {
      logInfo('Admin attempting to access admin endpoint...');
      
      await axios.get(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${testUsers.admin.token}`
        }
      });
      
      logSuccess('Admin successfully accessed admin endpoint');
    } catch (error) {
      if (error.response?.status === 404) {
        logWarning('Admin endpoint not found - skipping test');
      } else {
        logError(`Admin access failed: ${error.response?.data?.message || error.message}`);
      }
    }
  }
}

// Test 6: Token expiration (manual test)
async function testTokenExpiration() {
  logSection('TEST 6: Token Expiration (Manual Test)');
  
  logInfo('To test token expiration:');
  logInfo('1. Set JWT_EXPIRES_IN to a short duration (e.g., "10s") in backend .env');
  logInfo('2. Login and get a token');
  logInfo('3. Wait for token to expire');
  logInfo('4. Try to access protected endpoint');
  logInfo('5. Should receive TOKEN_EXPIRED error');
  
  logWarning('This test requires manual configuration - skipping automated test');
}

// Test 7: Check user status
async function testUserStatus() {
  logSection('TEST 7: User Active Status Check');
  
  logInfo('Testing user active status validation...');
  logInfo('Note: This requires a test user with isActive=false in database');
  logWarning('Skipping automated test - requires database setup');
}

// Main test runner
async function runAllTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         AUTHENTICATION GUARD TEST SUITE                   ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  logInfo(`API URL: ${API_URL}`);
  logInfo(`Starting tests at ${new Date().toLocaleString()}\n`);
  
  try {
    await testLogin();
    await testProtectedEndpoint();
    await testNoToken();
    await testInvalidToken();
    await testRoleBasedAccess();
    await testTokenExpiration();
    await testUserStatus();
    
    logSection('TEST SUMMARY');
    logSuccess('All automated tests completed!');
    logInfo('Check the results above for any failures');
    
  } catch (error) {
    logError(`Test suite failed: ${error.message}`);
    console.error(error);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testLogin,
  testProtectedEndpoint,
  testNoToken,
  testInvalidToken,
  testRoleBasedAccess
};
