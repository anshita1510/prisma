#!/usr/bin/env node

/**
 * Test script to verify available employees endpoint
 * Usage: node test-available-employees.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

// Test data
const testCredentials = {
  email: 'admin@tikr.com',
  password: 'Admin@123'
};

async function runTests() {
  try {
    console.log('🧪 Testing Available Employees Endpoint\n');
    console.log('=' .repeat(60));

    // Step 1: Login
    console.log('\n📝 Step 1: Login');
    console.log('-'.repeat(60));
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, testCredentials);
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const { token, user } = loginResponse.data;
    console.log('✅ Login successful');
    console.log(`   User: ${user.name} (ID: ${user.id})`);
    console.log(`   Company ID: ${user.companyId}`);
    console.log(`   Role: ${user.role}`);

    // Step 2: Get available employees
    console.log('\n📝 Step 2: Get Available Employees');
    console.log('-'.repeat(60));
    
    const employeesResponse = await axios.get(
      `${API_BASE_URL}/api/project-management/utils/available-employees?companyId=${user.companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!employeesResponse.data.success) {
      console.error('❌ Failed to fetch employees:', employeesResponse.data.message);
      return;
    }

    const employees = employeesResponse.data.data;
    console.log(`✅ Employees fetched: ${employees.length} found`);

    if (employees.length === 0) {
      console.warn('⚠️  No employees found in the company');
      return;
    }

    // Display employees
    console.log('\n📋 Employee List:');
    console.log('-'.repeat(60));
    employees.forEach((emp, index) => {
      console.log(`\n${index + 1}. ${emp.name}`);
      console.log(`   ID: ${emp.id}`);
      console.log(`   Code: ${emp.employeeCode}`);
      console.log(`   Designation: ${emp.designation}`);
      console.log(`   Department: ${emp.department?.name || 'N/A'}`);
      console.log(`   Email: ${emp.user?.email || 'N/A'}`);
      console.log(`   Role: ${emp.user?.role || 'N/A'}`);
    });

    // Extract unique departments
    const departments = Array.from(
      new Map(
        employees
          .filter(emp => emp.department)
          .map(emp => [emp.department.id, emp.department])
      ).values()
    );

    console.log('\n📋 Departments:');
    console.log('-'.repeat(60));
    departments.forEach((dept, index) => {
      console.log(`${index + 1}. ${dept.name} (ID: ${dept.id})`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || error.message}`);
      console.error(`   Data:`, error.response.data);
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

runTests();
