// Test script to verify attendance controller endpoints work correctly
import { PrismaClient } from '@prisma/client';
import { AttendanceController } from './modules/controller/attendance/attendance.controller';

const prisma = new PrismaClient();
const attendanceController = new AttendanceController();

// Mock request and response objects
function createMockReq(user: any, body: any = {}, params: any = {}, query: any = {}) {
  return {
    user,
    body,
    params,
    query
  } as any;
}

function createMockRes() {
  const res = {
    statusCode: 200,
    responseData: null as any,
    status: function(code: number) {
      this.statusCode = code;
      return this;
    },
    json: function(data: any) {
      this.responseData = data;
      return this;
    }
  };
  
  return res as any;
}

async function testAttendanceEndpoints() {
  try {
    console.log('🧪 Testing Attendance Controller Endpoints...');

    // Get a user with employee record
    const user = await prisma.user.findFirst({
      where: {
        isActive: true,
        status: 'ACTIVE',
        employee: {
          isNot: null
        }
      },
      include: {
        employee: true
      }
    });

    if (!user || !user.employee) {
      console.log('❌ No active user with employee record found');
      return;
    }

    console.log(`👤 Testing with user: ${user.firstName} ${user.lastName} (${user.email})`);

    // Test myCheckIn endpoint
    console.log('\n📥 Testing myCheckIn endpoint...');
    const checkInReq = createMockReq(user);
    const checkInRes = createMockRes();
    
    await attendanceController.myCheckIn(checkInReq, checkInRes);
    
    if (checkInRes.responseData?.success) {
      console.log('✅ myCheckIn successful:', checkInRes.responseData.message);
    } else {
      console.log('❌ myCheckIn failed:', checkInRes.responseData);
    }

    // Test getMyStats endpoint
    console.log('\n📈 Testing getMyStats endpoint...');
    const statsReq = createMockReq(user, {}, {}, { period: 'week' });
    const statsRes = createMockRes();
    
    await attendanceController.getMyStats(statsReq, statsRes);
    
    if (statsRes.responseData?.success) {
      console.log('✅ getMyStats successful:', statsRes.responseData.data);
    } else {
      console.log('❌ getMyStats failed:', statsRes.responseData);
    }

    // Test getMyLogs endpoint
    console.log('\n📋 Testing getMyLogs endpoint...');
    const logsReq = createMockReq(user, {}, {}, { days: '30' });
    const logsRes = createMockRes();
    
    await attendanceController.getMyLogs(logsReq, logsRes);
    
    if (logsRes.responseData?.success) {
      console.log('✅ getMyLogs successful, found', logsRes.responseData.data?.length || 0, 'logs');
    } else {
      console.log('❌ getMyLogs failed:', logsRes.responseData);
    }

    // Test getMyTodayAttendance endpoint
    console.log('\n📊 Testing getMyTodayAttendance endpoint...');
    const todayReq = createMockReq(user);
    const todayRes = createMockRes();
    
    await attendanceController.getMyTodayAttendance(todayReq, todayRes);
    
    if (todayRes.responseData?.success) {
      console.log('✅ getMyTodayAttendance successful:', todayRes.responseData.data?.status || 'No attendance today');
    } else {
      console.log('❌ getMyTodayAttendance failed:', todayRes.responseData);
    }

    // Test myCheckOut endpoint
    console.log('\n📤 Testing myCheckOut endpoint...');
    const checkOutReq = createMockReq(user);
    const checkOutRes = createMockRes();
    
    await attendanceController.myCheckOut(checkOutReq, checkOutRes);
    
    if (checkOutRes.responseData?.success) {
      console.log('✅ myCheckOut successful:', checkOutRes.responseData.message);
    } else {
      console.log('❌ myCheckOut failed:', checkOutRes.responseData);
    }

    console.log('\n🎉 All attendance endpoint tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  testAttendanceEndpoints();
}

export { testAttendanceEndpoints };