const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('🔧 Creating test users for authorization testing...');

    // Check if company exists
    let company = await prisma.company.findFirst({
      where: { id: 2 }
    });

    if (!company) {
      console.log('📢 Creating test company...');
      company = await prisma.company.create({
        data: {
          name: 'Test Company',
          code: 'TEST_COMP',
          email: 'test@company.com',
          phone: '1234567890',
          address: 'Test Address',
          isActive: true
        }
      });
      console.log(`✅ Created company: ${company.name} (ID: ${company.id})`);
    }

    // Check if department exists
    let department = await prisma.department.findFirst({
      where: { id: 2 }
    });

    if (!department) {
      console.log('📢 Creating test department...');
      department = await prisma.department.create({
        data: {
          name: 'Engineering',
          type: 'TECHNICAL',
          companyId: company.id
        }
      });
      console.log(`✅ Created department: ${department.name} (ID: ${department.id})`);
    }

    const testUsers = [
      {
        email: 'admin@company.com',
        password: 'admin123',
        role: 'ADMIN',
        name: 'Test Admin',
        designation: 'MANAGER',
        employeeCode: 'TEST_ADMIN_001'
      },
      {
        email: 'manager@company.com',
        password: 'manager123',
        role: 'MANAGER',
        name: 'Test Manager',
        designation: 'MANAGER',
        employeeCode: 'TEST_MGR_002'
      },
      {
        email: 'employee@company.com',
        password: 'employee123',
        role: 'EMPLOYEE',
        name: 'Test Employee',
        designation: 'SOFTWARE_ENGINEER',
        employeeCode: 'TEST_EMP_003'
      }
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user and employee in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: userData.email,
            firstName: userData.name.split(' ')[0],
            lastName: userData.name.split(' ')[1] || 'User',
            phone: '1234567890',
            designation: userData.designation,
            password: hashedPassword,
            role: userData.role,
            isActive: true,
            status: 'ACTIVE',
            companyId: company.id
          }
        });

        // Create employee
        const employee = await tx.employee.create({
          data: {
            name: userData.name,
            employeeCode: userData.employeeCode,
            designation: userData.designation,
            companyId: company.id,
            departmentId: department.id,
            userId: user.id,
            isActive: true
          }
        });

        return { user, employee };
      });

      console.log(`✅ Created user: ${userData.email} (Role: ${userData.role}, Employee ID: ${result.employee.id})`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: admin@company.com / admin123');
    console.log('   Manager: manager@company.com / manager123');
    console.log('   Employee: employee@company.com / employee123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();