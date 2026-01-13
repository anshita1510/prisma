// Demo data seeder for testing attendance system
import { PrismaClient, Role, Status, Designation, DepartmentType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...');

    // Create a demo company
    const company = await prisma.company.upsert({
      where: { code: 'DEMO_COMPANY' },
      update: {},
      create: {
        name: 'Demo Company',
        code: 'DEMO_COMPANY',
        isActive: true
      }
    });

    // Create a demo department
    const department = await prisma.department.upsert({
      where: { 
        companyId_name: {
          companyId: company.id,
          name: 'Engineering'
        }
      },
      update: {},
      create: {
        name: 'Engineering',
        type: DepartmentType.IT,
        companyId: company.id
      }
    });

    // Create demo users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: {},
      create: {
        email: 'admin@demo.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        designation: 'System Administrator',
        role: Role.ADMIN,
        status: Status.ACTIVE,
        password: hashedPassword,
        isActive: true,
        companyId: company.id
      }
    });

    // Employee user
    const employeeUser = await prisma.user.upsert({
      where: { email: 'employee@demo.com' },
      update: {},
      create: {
        email: 'employee@demo.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567891',
        designation: 'Software Engineer',
        role: Role.EMPLOYEE,
        status: Status.ACTIVE,
        password: hashedPassword,
        isActive: true,
        companyId: company.id
      }
    });

    // Create employee records
    const adminEmployee = await prisma.employee.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        companyId: company.id,
        departmentId: department.id,
        name: 'Admin User',
        designation: Designation.MANAGER,
        employeeCode: 'EMP001'
      }
    });

    const employee = await prisma.employee.upsert({
      where: { userId: employeeUser.id },
      update: {},
      create: {
        userId: employeeUser.id,
        companyId: company.id,
        departmentId: department.id,
        name: 'John Doe',
        designation: Designation.SOFTWARE_ENGINEER,
        employeeCode: 'EMP002',
        managerId: adminEmployee.id
      }
    });

    console.log('✅ Demo data seeded successfully!');
    console.log('📧 Admin login: admin@demo.com / password123');
    console.log('📧 Employee login: employee@demo.com / password123');
    console.log(`🏢 Company: ${company.name} (ID: ${company.id})`);
    console.log(`🏬 Department: ${department.name} (ID: ${department.id})`);
    console.log(`👤 Admin Employee ID: ${adminEmployee.id}`);
    console.log(`👤 Employee ID: ${employee.id}`);

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedDemoData();
}

export { seedDemoData };