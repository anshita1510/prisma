#!/usr/bin/env node

/**
 * Complete Auth Guard Testing Script
 * Tests all authentication and authorization scenarios
 */

const axios = require('axios');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const API_URL = process.env.API_URL || 'http://localhost:5004';

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logTest(name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  const color = passed ? 'green' : 'red';
  log(`${icon} ${name}`, color);
  if (details) {
    console.log(`   ${details}`);
  }
}

// Test credentials
const testUsers = {
  admin: { email: 'admin@tikr.com', password: 'Admin@123' },
  manager: { email: 'manager@tikr.com', password: 'Manager@123' },
  employee: { email: 'employee@tikr.com', password: 'Employee@123' }
};

let tokens = {};

async function testLogin(role, credentials) {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, credentials);
    
    if (response.data.token && response.data.user) {
      tokens[role] = response.data.token;
      logTest(
        `Login as ${role.toUpperCase()}`,
        true,
        `Token: ${response.data.token.substring(0, 20)}...`
      );
      return true;
    } else {
      logTest(`Login as ${role.toUpperCase()}`, false, 'No token received');
      return false;
    }
  } catch (error) {
    logTest(
      `Login as ${role.toUpperCase()}`,
      false,
      error.response?.data?.error || error.message
    );
    return false;
  }
}

async function testProtectedEndpoint(role, endpoint, expectedStatus = 200) {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${tokens[role]}` }
    });
    
    const passed = response.status === expectedStatus;
    logTest(
      `${role.toUpperCase()} access ${endpoint}`,
      passed,
      `Status: ${response.status}`
    );
    return passed;
  } catch (error) {
    const actualStatus = error.response?.status || 0;
    const passed = actualStatus === expectedStatus;
    logTest(
      `${role.toUpperCase()} access ${endpoint}`,
      passed,
      `Expected: ${expectedStatus}, Got: ${actualStatus}`
    );
    return passed;
  }
}

async function testUnauthorizedAccess(endpoint) {
  try {
    await axios.get(`${API_URL}${endpoint}`);
    logTest('Unauthorized access blocked', false, 'Request succeeded without token');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401;
    logTest(
      'Unauthorized access blocked',
      passed,
      `Status: ${error.response?.status || 'No response'}`
    );
    return passed;
  }
}

async function testInvalidToken(endpoint) {
  try {
    await axios.get(`${API_URL}${endpoint}`, {
      headers: { Authorization: 'Bearer invalid-token-12345' }
    });
    logTest('Invalid token rejected', false, 'Request succeeded with invalid token');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401;
    logTest(
      'Invalid token rejected',
      passed,
      `Status: ${error.response?.status || 'No response'}`
    );
    return passed;
  }
}

async function testRoleBasedAccess() {
  const tests = [
    // Admin should access admin endpoints
    { role: 'admin', endpoint: '/api/users/', expected: 200 },
    { role: 'admin', endpoint: '/api/users/me', expected: 200 },
    
    // Manager should NOT access admin-only endpoints
    { role: 'manager', endpoint: '/api/users/', expected: 403 },
    { role: 'manager', endpoint: '/api/users/me', expected: 200 },
    
    // Employee should NOT access admin endpoints
    { role: 'employee', endpoint: '/api/users/', expected: 403 },
    { role: 'employee', endpoint: '/api/users/me', expected: 200 },
  ];
  
  let passed = 0;
  for (const test of tests) {
    const result = await testProtectedEndpoint(test.role, test.endpoint, test.expected);
    if (result) passed++;
  }
  
  return { passed, total: tests.length };
}

async function testTokenValidation() {
  try {
    const response = await axios.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    
    if (response.data.success && response.data.user) {
      logTest(
        'Token validation with backend',
        true,
        `User: ${response.data.user.email}`
      );
      return true;
    } else {
      logTest('Token validation with backend', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest(
      'Token validation with backend',
      false,
      error.response?.data?.error || error.message
    );
    return false;
  }
}

async function testUserInvite() {
  try {
    const newUser = {
      email: `test.user.${Date.now()}@tikr.com`,
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      designation: 'Software Engineer',
      role: 'EMPLOYEE',
      employeeCode: `EMP${Date.now()}`
    };
    
    const response = await axios.post(
      `${API_URL}/api/users/register`,
      newUser,
      { headers: { Authorization: `Bearer ${tokens.admin}` } }
    );
    
    logTest(
      'Admin can invite employees',
      response.status === 201,
      `Status: ${response.status}`
    );
    return response.status === 201;
  } catch (error) {
    logTest(
      'Admin can invite employees',
      false,
      error.response?.data?.error || error.message
    );
    return false;
  }
}

async function testEmployeeCannotInvite() {
  try {
    const newUser = {
      email: `test.user.${Date.now()}@tikr.com`,
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      designation: 'Software Engineer',
      role: 'EMPLOYEE'
    };
    
    await axios.post(
      `${API_URL}/api/users/register`,
      newUser,
      { headers: { Authorization: `Bearer ${tokens.employee}` } }
    );
    
    logTest('Employee cannot invite users', false, 'Request succeeded');
    return false;
  } catch (error) {
    const passed = error.response?.status === 403;
    logTest(
      'Employee cannot invite users',
      passed,
      `Status: ${error.response?.status}`
    );
    return passed;
  }
}

async function runAllTests() {
  log('\n🔐 AUTH GUARD COMPLETE TEST SUITE', 'blue');
  log(`Testing API: ${API_URL}\n`, 'yellow');
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Test 1: Login Tests
  logSection('1️⃣  Authentication Tests');
  for (const [role, credentials] of Object.entries(testUsers)) {
    const result = await testLogin(role, credentials);
    totalTests++;
    if (result) passedTests++;
  }
  
  // Test 2: Unauthorized Access
  logSection('2️⃣  Unauthorized Access Tests');
  const unauthorizedResult = await testUnauthorizedAccess('/api/users/me');
  totalTests++;
  if (unauthorizedResult) passedTests++;
  
  // Test 3: Invalid Token
  logSection('3️⃣  Invalid Token Tests');
  const invalidTokenResult = await testInvalidToken('/api/users/me');
  totalTests++;
  if (invalidTokenResult) passedTests++;
  
  // Test 4: Token Validation
  logSection('4️⃣  Token Validation Tests');
  const validationResult = await testTokenValidation();
  totalTests++;
  if (validationResult) passedTests++;
  
  // Test 5: Role-Based Access Control
  logSection('5️⃣  Role-Based Access Control Tests');
  const rbacResults = await testRoleBasedAccess();
  totalTests += rbacResults.total;
  passedTests += rbacResults.passed;
  
  // Test 6: Permission Tests
  logSection('6️⃣  Permission Tests');
  const inviteResult = await testUserInvite();
  totalTests++;
  if (inviteResult) passedTests++;
  
  const employeeInviteResult = await testEmployeeCannotInvite();
  totalTests++;
  if (employeeInviteResult) passedTests++;
  
  // Summary
  logSection('📊 TEST SUMMARY');
  const percentage = ((passedTests / totalTests) * 100).toFixed(1);
  log(`Total Tests: ${totalTests}`, 'cyan');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${totalTests - passedTests}`, 'red');
  log(`Success Rate: ${percentage}%`, percentage === '100.0' ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('\n🎉 ALL TESTS PASSED! Auth Guard is working perfectly!', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please review the results above.', 'yellow');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Run tests
runAllTests().catch(error => {
  log('\n❌ Test suite failed with error:', 'red');
  console.error(error);
  process.exit(1);
});
