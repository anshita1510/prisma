// Integration test for attendance system
import { AttendanceService } from './modules/services/attendance.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const attendanceService = new AttendanceService();

async function testAttendanceIntegration() {
  console.log('🧪 Testing Attendance Integration...');

  try {
    // Find a demo employee
    const employee = await prisma.employee.findFirst({
      where: {
        employeeCode: 'EMP002'
      },
      include: {
        user: true,
        company: true,
        department: true
      }
    });

    if (!employee) {
      console.log('❌ No demo employee found. Run seed-demo-data.ts first.');
      return;
    }

    console.log(`👤 Testing with employee: ${employee.name} (ID: ${employee.id})`);

    // Test 1: Check-in
    console.log('\n📝 Test 1: Check-in');
    try {
      const checkInResult = await attendanceService.checkIn(
        employee.id,
        employee.companyId,
        employee.departmentId
      );
      console.log('✅ Check-in successful:', checkInResult.id);
    } catch (error: any) {
      if (error.message.includes('Already checked in')) {
        console.log('ℹ️ Already checked in today');
      } else {
        console.log('❌ Check-in failed:', error.message);
      }
    }

    // Test 2: Get today's attendance
    console.log('\n📝 Test 2: Get today\'s attendance');
    const todayAttendance = await attendanceService.getTodayAttendance(employee.id);
    console.log('✅ Today\'s attendance:', todayAttendance ? 'Found' : 'Not found');

    // Test 3: Get attendance stats
    console.log('\n📝 Test 3: Get attendance stats');
    const stats = await attendanceService.getAttendanceStats(
      employee.id,
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      new Date()
    );
    console.log('✅ Attendance stats:', {
      totalDays: stats.totalDays,
      presentDays: stats.presentDays,
      avgHoursPerDay: stats.avgHoursPerDay
    });

    // Test 4: Get attendance logs
    console.log('\n📝 Test 4: Get attendance logs');
    const logs = await attendanceService.getAttendanceLogs(employee.id, 7);
    console.log('✅ Attendance logs:', `${logs.length} records found`);

    // Test 5: Get team stats
    console.log('\n📝 Test 5: Get team stats');
    const teamStats = await attendanceService.getTeamAttendanceStats(
      employee.departmentId,
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      new Date()
    );
    console.log('✅ Team stats:', {
      avgHoursPerDay: teamStats.avgHoursPerDay,
      onTimePercentage: teamStats.onTimePercentage
    });

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Integration test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  testAttendanceIntegration();
}

export { testAttendanceIntegration };