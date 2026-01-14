const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

async function testProjectManagement() {
  try {
    console.log('🔍 Testing Project Management System...');
    
    // Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, {
      email: 'admin@tikr.com',
      password: 'Admin@123'
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data);
      return;
    }
    
    const { token, user } = loginResponse.data;
    console.log('✅ Login successful');
    console.log('👤 User:', user);
    
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Test 1: Create a new project
    console.log('\n2. Creating a new project...');
    const projectData = {
      name: 'E-commerce Platform Development',
      description: 'Building a modern e-commerce platform with React and Node.js',
      companyId: 2,
      departmentId: 2,
      ownerId: user.employeeId,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      budget: 250000,
      status: 'ACTIVE'
    };
    
    const createProjectResponse = await api.post('/api/project-management', projectData);
    console.log('✅ Project created:', createProjectResponse.data);
    
    const projectId = createProjectResponse.data.data.id;
    
    // Test 2: Get available employees
    console.log('\n3. Getting available employees...');
    const employeesResponse = await api.get('/api/project-management/utils/available-employees?companyId=2');
    console.log('✅ Available employees:', employeesResponse.data.data.length);
    
    const availableEmployees = employeesResponse.data.data;
    
    // Test 3: Assign team members
    if (availableEmployees.length > 1) {
      console.log('\n4. Assigning team members...');
      
      // Assign first available employee as manager
      const employee1 = availableEmployees.find(emp => emp.id !== user.employeeId);
      if (employee1) {
        const assignResponse1 = await api.post(`/api/project-management/${projectId}/members`, {
          employeeId: employee1.id,
          role: 'MANAGER'
        });
        console.log('✅ Team member assigned as manager:', assignResponse1.data);
      }
      
      // Assign second employee as member
      const employee2 = availableEmployees.find(emp => emp.id !== user.employeeId && emp.id !== employee1?.id);
      if (employee2) {
        const assignResponse2 = await api.post(`/api/project-management/${projectId}/members`, {
          employeeId: employee2.id,
          role: 'MEMBER'
        });
        console.log('✅ Team member assigned as member:', assignResponse2.data);
      }
    }
    
    // Test 4: Create tasks
    console.log('\n5. Creating project tasks...');
    
    const tasks = [
      {
        title: 'Setup Development Environment',
        description: 'Configure development tools and environment',
        projectId: projectId,
        createdById: user.employeeId,
        priority: 'HIGH',
        status: 'TODO',
        estimatedHours: 8,
        dueDate: '2024-01-20'
      },
      {
        title: 'Design Database Schema',
        description: 'Create database design and relationships',
        projectId: projectId,
        createdById: user.employeeId,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        estimatedHours: 16,
        dueDate: '2024-01-25'
      },
      {
        title: 'Implement User Authentication',
        description: 'Build login and registration functionality',
        projectId: projectId,
        createdById: user.employeeId,
        priority: 'MEDIUM',
        status: 'TODO',
        estimatedHours: 24,
        dueDate: '2024-02-05'
      }
    ];
    
    for (const task of tasks) {
      const taskResponse = await api.post(`/api/project-management/${projectId}/tasks`, task);
      console.log('✅ Task created:', taskResponse.data.data.title);
    }
    
    // Test 5: Get project details
    console.log('\n6. Getting project details...');
    const projectDetailsResponse = await api.get(`/api/project-management/${projectId}`);
    console.log('✅ Project details loaded');
    console.log('📊 Project stats:');
    console.log(`- Name: ${projectDetailsResponse.data.data.name}`);
    console.log(`- Status: ${projectDetailsResponse.data.data.status}`);
    console.log(`- Team members: ${projectDetailsResponse.data.data.members.length}`);
    console.log(`- Tasks: ${projectDetailsResponse.data.data.tasks.length}`);
    
    // Test 6: Get all projects
    console.log('\n7. Getting all projects...');
    const allProjectsResponse = await api.get('/api/project-management?companyId=2');
    console.log('✅ All projects loaded:', allProjectsResponse.data.data.length);
    
    // Test 7: Get dashboard stats
    console.log('\n8. Getting dashboard statistics...');
    const statsResponse = await api.get('/api/project-management/dashboard/stats?companyId=2');
    console.log('✅ Dashboard stats:', statsResponse.data.data);
    
    // Test 8: Update task status
    console.log('\n9. Updating task status...');
    const projectTasks = await api.get(`/api/project-management/${projectId}/tasks`);
    if (projectTasks.data.data.length > 0) {
      const firstTask = projectTasks.data.data[0];
      const updateTaskResponse = await api.put(`/api/project-management/tasks/${firstTask.id}`, {
        status: 'COMPLETED',
        actualHours: 6,
        progressPercentage: 100
      });
      console.log('✅ Task updated:', updateTaskResponse.data.data.title);
    }
    
    console.log('\n🎉 Project Management System test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testProjectManagement();