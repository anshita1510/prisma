const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

// Test user credentials
const testUser = {
  email: 'admin@example.com',
  password: 'password123'
};

async function testModalAPI() {
  try {
    console.log('🧪 Testing Create Project Modal API Connection\n');
    
    // Step 1: Login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, testUser);
    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   User ID: ${user.id}`);
    console.log(`   Company ID: ${user.companyId}\n`);
    
    // Step 2: Get available employees
    console.log('2️⃣ Fetching available employees...');
    const employeesResponse = await axios.get(
      `${API_BASE_URL}/api/project-management/utils/available-employees?companyId=${user.companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Available employees fetched');
    console.log(`   Total employees: ${employeesResponse.data.data.length}`);
    if (employeesResponse.data.data.length > 0) {
      console.log(`   Sample employee: ${employeesResponse.data.data[0].name} (${employeesResponse.data.data[0].designation})`);
    }
    console.log();
    
    // Step 3: Create a project
    console.log('3️⃣ Creating a test project...');
    const projectData = {
      name: `Test Project ${Date.now()}`,
      description: 'Test project from modal API test',
      departmentId: user.departmentId || 2,
      companyId: user.companyId,
      ownerId: user.id,
      memberIds: employeesResponse.data.data.slice(0, 2).map(emp => emp.id)
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
    
    console.log('🎉 All tests passed! Modal API connection is working correctly.\n');
    
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message}`);
      console.error(`   Data:`, error.response.data);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

testModalAPI();
