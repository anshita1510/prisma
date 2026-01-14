const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

async function testFrontendAPI() {
  console.log('🔍 TESTING FRONTEND API CALLS');
  console.log('='.repeat(50));

  try {
    // Step 1: Login
    console.log('\n1️⃣  TESTING LOGIN');
    console.log('-'.repeat(30));
    
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, {
      email: 'admin@company.com',
      password: 'admin123'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log(`   User: ${loginResponse.data.user.name}`);
      console.log(`   Role: ${loginResponse.data.user.role}`);
      console.log(`   Employee ID: ${loginResponse.data.user.employeeId}`);
      
      const token = loginResponse.data.token;
      
      // Step 2: Test Available Employees
      console.log('\n2️⃣  TESTING AVAILABLE EMPLOYEES');
      console.log('-'.repeat(30));
      
      try {
        const employeesResponse = await axios.get(`${API_BASE_URL}/api/project-management/utils/available-employees?companyId=2`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (employeesResponse.data.success) {
          console.log(`✅ Found ${employeesResponse.data.data.length} available employees`);
          employeesResponse.data.data.forEach(emp => {
            console.log(`   - ${emp.name} (${emp.designation}) - ${emp.employeeCode}`);
          });
        }
      } catch (error) {
        console.log('❌ Available employees error:', error.response?.data?.message || error.message);
      }

      // Step 3: Test Project Creation (same as frontend)
      console.log('\n3️⃣  TESTING PROJECT CREATION (Frontend Style)');
      console.log('-'.repeat(30));
      
      const projectData = {
        name: `Frontend Test Project ${Date.now()}`,
        description: 'Testing project creation from frontend perspective',
        companyId: 2,
        departmentId: 2,
        ownerId: loginResponse.data.user.employeeId,
        status: 'PLANNING'
      };
      
      try {
        const projectResponse = await axios.post(`${API_BASE_URL}/api/project-management`, projectData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (projectResponse.data.success) {
          console.log('✅ Project created successfully');
          console.log(`   Project ID: ${projectResponse.data.data.id}`);
          console.log(`   Project Code: ${projectResponse.data.data.code}`);
          console.log(`   Project Name: ${projectResponse.data.data.name}`);
          console.log(`   Owner: ${projectResponse.data.data.owner.name}`);
        }
      } catch (error) {
        console.log('❌ Project creation error:', error.response?.data?.message || error.message);
        if (error.response?.data?.errors) {
          console.log('   Validation errors:', error.response.data.errors);
        }
      }

      // Step 4: Test Enhanced Project Creation
      console.log('\n4️⃣  TESTING ENHANCED PROJECT CREATION');
      console.log('-'.repeat(30));
      
      const enhancedProjectData = {
        name: `Enhanced Frontend Test Project ${Date.now()}`,
        description: 'Testing enhanced project creation',
        companyId: 2,
        departmentId: 2,
        startDate: '2024-02-01',
        endDate: '2024-06-30',
        budget: 50000,
        teamMembers: [
          { employeeId: 22, role: 'MEMBER' }
        ]
      };
      
      try {
        const enhancedResponse = await axios.post(`${API_BASE_URL}/api/project-management/enhanced`, enhancedProjectData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (enhancedResponse.data.success) {
          console.log('✅ Enhanced project created successfully');
          console.log(`   Project ID: ${enhancedResponse.data.data.project.id}`);
          console.log(`   Team Members: ${enhancedResponse.data.data.teamMembers.length}`);
        }
      } catch (error) {
        console.log('❌ Enhanced project creation error:', error.response?.data?.message || error.message);
        if (error.response?.data?.errors) {
          console.log('   Validation errors:', error.response.data.errors);
        }
      }

      // Step 5: Test Permissions
      console.log('\n5️⃣  TESTING PERMISSIONS');
      console.log('-'.repeat(30));
      
      try {
        const permissionsResponse = await axios.get(`${API_BASE_URL}/api/project-management/permissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (permissionsResponse.data.success) {
          console.log('✅ Permissions retrieved successfully');
          console.log(`   Can Create Project: ${permissionsResponse.data.data.canCreateProject}`);
          console.log(`   User Role: ${permissionsResponse.data.data.userRole}`);
          console.log(`   Permissions: ${permissionsResponse.data.data.permissions.join(', ')}`);
        }
      } catch (error) {
        console.log('❌ Permissions error:', error.response?.data?.message || error.message);
      }

    } else {
      console.log('❌ Login failed:', loginResponse.data.message);
    }

  } catch (error) {
    console.log('❌ Login error:', error.response?.data?.message || error.message);
  }

  console.log('\n📊 FRONTEND API TEST COMPLETE');
  console.log('='.repeat(50));
}

testFrontendAPI().catch(console.error);