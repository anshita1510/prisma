// Test script to verify attendance system works with existing users
import { PrismaClient } from '@prisma/client';
import { AttendanceService } from './modules/services/attendance.service';

const prisma = new PrismaClient();
const attendanceService = new AttendanceService();

async function testAttendanceSystem() {
  try {
    console.log('🧪 Testing Attendance System...');

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
        employee: {
          include: {
            company: true,
            department: true
          }
        }
      }
    });

    if (!user || !user.employee) {
      console.log('❌ No active user with employee record found');
      return;
    }

    console.log(`👤 Testing with user: ${user.firstName} ${user.lastName} (${user.email})`);
    console.log(`🏢 Employee: ${user.employee.name} (${user.employee.employeeCode})`);

    // Test check-in
    console.log('\n📥 Testing check-in...');
    const checkInResult = await attendanceService.checkIn(
      user.employee.id,
      user.employee.companyId,
      user.employee.departmentId
    );
    console.log('✅ Check-in successful:', checkInResult);

    // Test getting today's attendance
    console.log('\n📊 Testing get today attendance...');
    const todayAttendance = await attendanceService.getTodayAttendance(user.employee.id);
    console.log('✅ Today attendance:', todayAttendance);

    // Test getting stats
    console.log('\n📈 Testing get stats...');
    const stats = await attendanceService.getAttendanceStats(
      user.employee.id,
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      new Date()
    );
    console.log('✅ Stats:', stats);

    // Test check-out
    console.log('\n📤 Testing check-out...');
    const checkOutResult = await attendanceService.checkOut(user.employee.id);
    console.log('✅ Check-out successful:', checkOutResult);

    console.log('\n🎉 All attendance tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  testAttendanceSystem();
}

export { testAttendanceSystem };