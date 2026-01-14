/**
 * Test Task Creation Flow
 * Tests the complete task creation process from frontend to backend
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5004';

// Test data
let testToken = '';
let testProjectId = 0;
let testEmployeeId = 0;
let testCompanyId = 0;

const api = axios.create({
  baseURL: API_BASE_URL,
  validateStatus: () => true // Don't throw on any status
});

// Helper to add auth header
const withAuth = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

async function runTests() {
  console.log('🚀 Starting Task Creation Flow Tests\n');

  try {
    // Step 1: Login
    console.log('📝 Step 1: Login to get token and employee ID');
    const loginRes = await api.post('/api/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });

    if (loginRes.status !== 200) {
      console.error('❌ Login failed:', loginRes.data);
      return;
    }

    testToken = loginRes.data.data.token;
    testEmployeeId = loginRes.data.data.employeeId;
    testCompanyId = loginRes.data.data.companyId;
    console.log('✅ Login successful');
    console.log(`   Token: ${testToken.substring(0, 20)}...`);
    console.log(`   Employee ID: ${testEmployeeId}`);
    console.log(`   Company ID: ${testCompanyId}\n`);

    // Step 2: Get or create a project
    console.log('📝 Step 2: Get projects');
    const projectsRes = await api.get('/api/project-management', withAuth(testToken));

    if (projectsRes.status !== 200 || !projectsRes.data.data || projectsRes.data.data.length === 0) {
      console.error('❌ No projects found. Please create a project first.');
      return;
    }

    testProjectId = projectsRes.data.data[0].id;
    console.log('✅ Found project');
    console.log(`   Project ID: ${testProjectId}`);
    console.log(`   Project Name: ${projectsRes.data.data[0].name}\n`);

    // Step 3: Get project members
    console.log('📝 Step 3: Get project members');
    const membersRes = await api.get(
      `/api/project-management/${testProjectId}/members`,
      withAuth(testToken)
    );

    if (membersRes.status !== 200) {
      console.error('❌ Failed to get project members:', membersRes.data);
      return;
    }

    console.log('✅ Project members retrieved');
    console.log(`   Total members: ${membersRes.data.data.length}`);
    if (membersRes.data.data.length > 0) {
      console.log(`   First member: ${membersRes.data.data[0].employee.name}\n`);
    }

    // Step 4: Create a task
    console.log('📝 Step 4: Create task');
    const taskPayload = {
      title: 'Test Task - ' + new Date().toISOString(),
      description: 'This is a test task created via API',
      projectId: testProjectId,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 8,
      createdById: testEmployeeId,
      assignedToId: membersRes.data.data.length > 0 ? membersRes.data.data[0].employee.id : undefined
    };

    console.log('   Payload:', JSON.stringify(taskPayload, null, 2));

    const taskRes = await api.post(
      `/api/project-management/${testProjectId}/tasks`,
      taskPayload,
      withAuth(testToken)
    );

    if (taskRes.status !== 201) {
      console.error('❌ Task creation failed');
      console.error('   Status:', taskRes.status);
      console.error('   Response:', JSON.stringify(taskRes.data, null, 2));
      return;
    }

    console.log('✅ Task created successfully');
    console.log(`   Task ID: ${taskRes.data.data.id}`);
    console.log(`   Task Title: ${taskRes.data.data.title}`);
    console.log(`   Task Code: ${taskRes.data.data.code}\n`);

    // Step 5: Get project tasks
    console.log('📝 Step 5: Get project tasks');
    const tasksRes = await api.get(
      `/api/project-management/${testProjectId}/tasks`,
      withAuth(testToken)
    );

    if (tasksRes.status !== 200) {
      console.error('❌ Failed to get tasks:', tasksRes.data);
      return;
    }

    console.log('✅ Tasks retrieved');
    console.log(`   Total tasks: ${tasksRes.data.data.length}`);
    console.log(`   Latest task: ${tasksRes.data.data[0].title}\n`);

    console.log('✅ All tests passed!\n');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run tests
runTests();
