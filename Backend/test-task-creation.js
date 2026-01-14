#!/usr/bin/env node

/**
 * Test script to verify task creation endpoint
 * Usage: node test-task-creation.js
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
    console.log('🧪 Testing Task Creation Endpoint\n');
    console.log('='.repeat(60));

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
    console.log(`   Employee ID: ${user.employeeId}`);
    console.log(`   Company ID: ${user.companyId}`);

    // Step 2: Get available projects
    console.log('\n📝 Step 2: Get Available Projects');
    console.log('-'.repeat(60));
    
    const projectsResponse = await axios.get(
      `${API_BASE_URL}/api/project-management`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!projectsResponse.data.success || projectsResponse.data.data.length === 0) {
      console.warn('⚠️  No projects found. Creating a test project first...');
      
      // Create a test project
      const createProjectResponse = await axios.post(
        `${API_BASE_URL}/api/project-management`,
        {
          name: `Test Project ${Date.now()}`,
          description: 'Test project for task creation',
          departmentId: 1,
          companyId: user.companyId,
          ownerId: user.employeeId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!createProjectResponse.data.success) {
        console.error('❌ Failed to create test project:', createProjectResponse.data.message);
        return;
      }

      console.log('✅ Test project created');
      var testProject = createProjectResponse.data.data;
    } else {
      var testProject = projectsResponse.data.data[0];
    }

    console.log(`✅ Using project: ${testProject.name} (ID: ${testProject.id})`);

    // Step 3: Create a task
    console.log('\n📝 Step 3: Create Task');
    console.log('-'.repeat(60));
    
    const taskData = {
      title: `Test Task ${Date.now()}`,
      description: 'This is a test task created via API',
      projectId: testProject.id,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      estimatedHours: 8
    };

    console.log('📤 Sending task creation request:');
    console.log(JSON.stringify(taskData, null, 2));

    const taskResponse = await axios.post(
      `${API_BASE_URL}/api/project-management/${testProject.id}/tasks`,
      taskData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!taskResponse.data.success) {
      console.error('❌ Failed to create task:', taskResponse.data.message);
      return;
    }

    const createdTask = taskResponse.data.data;
    console.log('✅ Task created successfully');
    console.log(`   Task ID: ${createdTask.id}`);
    console.log(`   Title: ${createdTask.title}`);
    console.log(`   Status: ${createdTask.status}`);
    console.log(`   Priority: ${createdTask.priority}`);
    console.log(`   Created By: ${createdTask.createdBy?.name || 'N/A'}`);

    // Step 4: Get project tasks
    console.log('\n📝 Step 4: Get Project Tasks');
    console.log('-'.repeat(60));
    
    const tasksResponse = await axios.get(
      `${API_BASE_URL}/api/project-management/${testProject.id}/tasks`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!tasksResponse.data.success) {
      console.error('❌ Failed to fetch tasks:', tasksResponse.data.message);
      return;
    }

    const tasks = tasksResponse.data.data;
    console.log(`✅ Tasks fetched: ${tasks.length} found`);
    
    console.log('\n📋 Task List:');
    tasks.forEach((task, index) => {
      console.log(`\n${index + 1}. ${task.title}`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Status: ${task.status}`);
      console.log(`   Priority: ${task.priority}`);
      console.log(`   Assigned To: ${task.assignedTo?.name || 'Unassigned'}`);
      console.log(`   Created By: ${task.createdBy?.name || 'N/A'}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!\n');

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
