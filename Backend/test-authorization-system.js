const axios = require('axios');

const BASE_URL = 'http://localhost:5004/api';

// Test data
const testUsers = {
  admin: {
    email: 'admin@company.com',
    password: 'admin123'
  },
  manager: {
    email: 'manager@company.com', 
    password: 'manager123'
  },
  employee: {
    email: 'employee@company.com',
    password: 'employee123'
  }
};

let tokens = {};

async function login(userType) {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, testUsers[userType]);
    if (response.data.success) {
      tokens[userType] = response.data.token;
      console.log(`✅ ${userType} login successful`);
      return response.data.token;
    } else {
      console.log(`❌ ${userType} login failed:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${userType} login error:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function testPermissions(userType, token) {
  try {
    const response = await axios.get(`${BASE_URL}/project-management/permissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log(`\n📋 ${userType.toUpperCase()} Permissions:`);
      console.log(`   Role: ${response.data.data.userRole}`);
      console.log(`   Designation: ${response.data.data.userDesignation}`);
      console.log(`   Can Create Project: ${response.data.data.canCreateProject}`);
      console.log(`   Can Update Project: ${response.data.data.canUpdateProject}`);
      console.log(`   Can Delete Project: ${response.data.data.canDeleteProject}`);
      console.log(`   Can Manage Team: ${response.data.data.canManageTeam}`);
      console.log(`   All Permissions: ${response.data.data.permissions.join(', ')}`);
      return response.data.data;
    } else {
      console.log(`❌ ${userType} permission check failed:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${userType} permission check error:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function testProjectCreation(userType, token) {
  const projectData = {
    name: `Test Project by ${userType}`,
    description: `This is a test project created by ${userType}`,
    code: `TEST_${userType.toUpperCase()}_${Date.now()}`,
    companyId: 2,
    departmentId: 2,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    budget: 50000,
    status: 'PLANNING',
    teamMembers: []
  };

  try {
    const response = await axios.post(`${BASE_URL}/project-management`, projectData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log(`\n✅ ${userType} successfully created project: ${response.data.data.name}`);
      console.log(`   Project ID: ${response.data.data.id}`);
      console.log(`   Owner: ${response.data.data.owner.name}`);
      return response.data.data;
    } else {
      console.log(`\n❌ ${userType} project creation failed:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.log(`\n❌ ${userType} project creation error:`, error.response?.data?.message || error.message);
    if (error.response?.data?.error === 'PERMISSION_DENIED') {
      console.log(`   ℹ️  This is expected for users without project creation permissions`);
    }
    return null;
  }
}

async function testGetAvailableEmployees(userType, token) {
  try {
    const response = await axios.get(`${BASE_URL}/project-management/utils/available-employees?companyId=2`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log(`\n👥 ${userType} can see ${response.data.data.length} available employees`);
      return response.data.data;
    } else {
      console.log(`\n❌ ${userType} failed to get employees:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.log(`\n❌ ${userType} get employees error:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function runAuthorizationTests() {
  console.log('🔐 AUTHORIZATION SYSTEM TEST');
  console.log('=' .repeat(50));

  // Test login for all user types
  console.log('\n1️⃣  TESTING USER AUTHENTICATION');
  console.log('-'.repeat(30));
  
  for (const userType of Object.keys(testUsers)) {
    await login(userType);
  }

  // Test permissions for each user type
  console.log('\n2️⃣  TESTING USER PERMISSIONS');
  console.log('-'.repeat(30));
  
  for (const [userType, token] of Object.entries(tokens)) {
    if (token) {
      await testPermissions(userType, token);
    }
  }

  // Test project creation for each user type
  console.log('\n3️⃣  TESTING PROJECT CREATION AUTHORIZATION');
  console.log('-'.repeat(40));
  
  const createdProjects = [];
  for (const [userType, token] of Object.entries(tokens)) {
    if (token) {
      const project = await testProjectCreation(userType, token);
      if (project) {
        createdProjects.push({ userType, project });
      }
    }
  }

  // Test available employees endpoint
  console.log('\n4️⃣  TESTING AVAILABLE EMPLOYEES ENDPOINT');
  console.log('-'.repeat(40));
  
  for (const [userType, token] of Object.entries(tokens)) {
    if (token) {
      await testGetAvailableEmployees(userType, token);
    }
  }

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Successfully logged in users: ${Object.keys(tokens).length}`);
  console.log(`✅ Successfully created projects: ${createdProjects.length}`);
  
  if (createdProjects.length > 0) {
    console.log('\n📋 Created Projects:');
    createdProjects.forEach(({ userType, project }) => {
      console.log(`   - ${project.name} (ID: ${project.id}) by ${userType}`);
    });
  }

  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   - ADMIN and MANAGER should be able to create projects');
  console.log('   - EMPLOYEE should be denied project creation');
  console.log('   - All authenticated users should see their permissions');
  console.log('   - ADMIN and MANAGER should see available employees');
}

// Run the tests
runAuthorizationTests().catch(console.error);