const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

async function testProjectCreation() {
  try {
    console.log('🧪 Testing Project Creation Flow\n');
    
    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    
    console.log('✅ Login successful');
    console.log(`   User ID: ${user.id}`);
    console.log(`   User Role: ${user.role}`);
    console.log(`   User Designation: ${user.designation}`);
    console.log(`   Company ID: ${user.companyId}\n`);
    
    // Step 2: Check if user has permission to create projects
    console.log('2️⃣ Checking project creation permissions...');
    console.log(`   Required roles: ADMIN, MANAGER`);
    console.log(`   Required designations: MANAGER, TECH_LEAD`);
    console.log(`   User role: ${user.role}`);
    console.log(`   User designation: ${user.designation}`);
    
    const hasPermission = 
      (user.role === 'ADMIN' || user.role === 'MANAGER') ||
      (user.designation === 'MANAGER' || user.designation === 'TECH_LEAD');
    
    if (!hasPermission) {
      console.log('❌ User does NOT have permission to create projects\n');
      console.log('⚠️  To fix this, you need to:');
      console.log('   1. Update user role to ADMIN or MANAGER, OR');
      console.log('   2. Update user designation to MANAGER or TECH_LEAD\n');
      return;
    }
    
    console.log('✅ User has permission to create projects\n');
    
    // Step 3: Create a project
    console.log('3️⃣ Creating a test project...');
    const projectData = {
      name: `Test Project ${Date.now()}`,
      description: 'Test project for debugging',
      departmentId: user.departmentId || 2,
      companyId: user.companyId,
      ownerId: user.id,
      memberIds: []
    };
    
    console.log(`   Project data:`, projectData);
    
    const projectResponse = await axios.post(
      `${API_BASE_URL}/api/project-management`,
      projectData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Project created successfully');
    console.log(`   Project ID: ${projectResponse.data.data.id}`);
    console.log(`   Project Name: ${projectResponse.data.data.name}`);
    console.log(`   Status: ${projectResponse.data.data.status}\n`);
    
    console.log('🎉 All tests passed!\n');
    
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message}`);
      console.error(`   Error: ${error.response.data.error}`);
      if (error.response.data.requiredPermissions) {
        console.error(`   Required Permissions: ${error.response.data.requiredPermissions.join(', ')}`);
      }
      if (error.response.data.userRole) {
        console.error(`   User Role: ${error.response.data.userRole}`);
      }
      if (error.response.data.userDesignation) {
        console.error(`   User Designation: ${error.response.data.userDesignation}`);
      }
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

testProjectCreation();
