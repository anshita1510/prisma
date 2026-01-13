// // Simple test script to verify attendance service
// import { AttendanceService } from './modules/services/attendance.service';

// async function testAttendanceService() {
//   const attendanceService = new AttendanceService();
  
//   try {
//     console.log('🧪 Testing Attendance Service...');
    
//     // Test getting today's attendance (should return null for non-existent employee)
//     const todayAttendance = await attendanceService.getTodayAttendance(999);
//     console.log('✅ getTodayAttendance test passed:', todayAttendance === null);
    
//     console.log('🎉 All tests passed!');
//   } catch (error) {
//     console.error('❌ Test failed:', error);
//   }
// }

// // Only run if this file is executed directly
// if (require.main === module) {
//   testAttendanceService();
// }