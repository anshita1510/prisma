const axios = require('axios');

const BASE_URL = 'http://localhost:5004/api';

// Test users with different roles and designations
const testUsers = {
  admin: {
    email: 'admin@company.com',
    password: 'admin123'
  },
  manager: {
    email: 'manager@company.com', 
    password: 'manager123'
  },
  techLead: {
    email: 'techlead@company.com',
    password: 'techlead123'
  },
  employee: {
    email: 'employee@company.com',
    password: 'employee123'
  }
};

// Test project creation permissions
async function testProjectCreationPermissions() {
  console.log('🔐 TESTING PROJECT CREATION PERMISSIONS');
  console.log('='.repeat(50));

  const tokens = {};

  // Step 1: Login all users
  console.log('\n1️⃣  LOGGING IN TEST USERS');
  console.log('-'.repeat(30));
  
  for (const [userType, credentials] of Object.entries(testUsers)) {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, credentials);
      if (response.data.success) {
        tokens[userType] = response.data.data.token;
        console.log(`✅ ${userType.toUpperCase()} logged in successfully`);
      }
    } catch (error) {
      console.log(`❌ ${userType.toUpperCase()} login failed:`, error.response?.data?.message || error.message);
    }
  }

  // Step 2: Test project creation for each user
  console.log('\n2️⃣  TESTING PROJECT CREATION');
  console.log('-'.repeat(30));

  const projectData = {
    name: 'Test Dynamic Project',
    description: 'Testing dynamic project creation with permissions',
    companyId: 2,
    departmentId: 2,
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    budget: 50000,
    teamMembers: [
      { employeeId: 3, role: 'MEMBER' },
      { employeeId: 4, role: 'VIEWER' }
    ]
  };

  for (const [userType, token] of Object.entries(tokens)) {
    if (!token) continue;

    try {
      const response = await axios.post(`${BASE_URL}/project-management/projects`, projectData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        console.log(`✅ ${userType.toUpperCase()}: Project created successfully`);
        console.log(`   Project ID: ${response.data.data.id}`);
        console.log(`   Project Code: ${response.data.data.code}`);
        
        // Clean up - delete the test project
        try {
          await axios.delete(`${BASE_URL}/project-management/projects/${response.data.data.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`   🗑️  Test project cleaned up`);
        } catch (deleteError) {
          console.log(`   ⚠️  Could not clean up test project`);
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      const errorCode = error.response?.status || 'Unknown';
      console.log(`❌ ${userType.toUpperCase()}: ${errorMsg} (${errorCode})`);
      
      if (error.response?.data?.requiredPermissions) {
        console.log(`   Required: ${error.response.data.requiredPermissions.join(', ')}`);
      }
    }
  }

  // Step 3: Test permission checking endpoint
  console.log('\n3️⃣  TESTING PERMISSION CHECKING');
  console.log('-'.repeat(30));

  for (const [userType, token] of Object.entries(tokens)) {
    if (!token) continue;

    try {
      const response = await axios.get(`${BASE_URL}/project-management/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const permissions = response.data.data.permissions;
        const canCreate = response.data.data.canCreateProject;
        
        console.log(`✅ ${userType.toUpperCase()}:`);
        console.log(`   Can Create Project: ${canCreate ? '✅' : '❌'}`);
        console.log(`   Role: ${response.data.data.userRole}`);
        console.log(`   Designation: ${response.data.data.userDesignation || 'N/A'}`);
        console.log(`   Permissions: ${permissions.length > 0 ? permissions.join(', ') : 'None'}`);
      }
    } catch (error) {
      console.log(`❌ ${userType.toUpperCase()}: Failed to check permissions`);
    }
  }

  // Step 4: Test available employees endpoint
  console.log('\n4️⃣  TESTING AVAILABLE EMPLOYEES');
  console.log('-'.repeat(30));

  for (const [userType, token] of Object.entries(tokens)) {
    if (!token) continue;

    try {
      const response = await axios.get(`${BASE_URL}/project-management/available-employees?companyId=2`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const employees = response.data.data;
        console.log(`✅ ${userType.toUpperCase()}: Found ${employees.length} available employees`);
        
        if (employees.length > 0) {
          console.log(`   Sample: ${employees[0].name} (${employees[0].designation})`);
        }
      }
    } catch (error) {
      console.log(`❌ ${userType.toUpperCase()}: Failed to fetch employees`);
    }
  }

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log('✅ Successfully logged in users:', Object.keys(tokens).length);
  console.log('🎯 EXPECTED BEHAVIOR:');
  console.log('   - ADMIN and MANAGER should be able to create projects');
  console.log('   - TECH_LEAD should be able to create projects');
  console.log('   - EMPLOYEE should be denied project creation');
  console.log('   - All authenticated users should see their permissions');
  console.log('   - ADMIN and MANAGER should see available employees');
}

// Run the test
testProjectCreationPermissions().catch(console.error);