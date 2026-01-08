const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestEmployees() {
  try {
    console.log('Creating test employees...');

    // Get existing company and department
    const company = await prisma.company.findFirst();
    const department = await prisma.department.findFirst();

    if (!company || !department) {
      console.error('Company or department not found. Run seed first.');
      return;
    }

    const passwordHash = await bcrypt.hash('Employee@123', 10);

    // Create test employees
    const testEmployees = [
      {
        email: 'john.doe@tikr.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        designation: 'Software Engineer',
        name: 'John Doe',
        employeeCode: 'EMP-0002',
        prismaDesignation: 'SOFTWARE_ENGINEER'
      },
      {
        email: 'jane.smith@tikr.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '1234567891',
        designation: 'Senior Engineer',
        name: 'Jane Smith',
        employeeCode: 'EMP-0003',
        prismaDesignation: 'SENIOR_ENGINEER'
      },
      {
        email: 'mike.johnson@tikr.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '1234567892',
        designation: 'Manager',
        name: 'Mike Johnson',
        employeeCode: 'EMP-0004',
        prismaDesignation: 'MANAGER'
      }
    ];

    for (const emp of testEmployees) {
      // Create user
      const user = await prisma.user.create({
        data: {
          email: emp.email,
          firstName: emp.firstName,
          lastName: emp.lastName,
          phone: emp.phone,
          designation: emp.designation,
          role: 'EMPLOYEE',
          status: 'ACTIVE',
          password: passwordHash,
          isActive: true,
          companyId: company.id
        }
      });

      // Create employee
      await prisma.employee.create({
        data: {
          userId: user.id,
          companyId: company.id,
          departmentId: department.id,
          name: emp.name,
          designation: emp.prismaDesignation,
          employeeCode: emp.employeeCode,
          isActive: true
        }
      });

      console.log(`✅ Created employee: ${emp.name}`);
    }

    console.log('✅ Test employees created successfully!');
    console.log('📧 Login credentials for all employees: Employee@123');

  } catch (error) {
    console.error('❌ Error creating test employees:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestEmployees();