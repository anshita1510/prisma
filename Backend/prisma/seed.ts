import { PrismaClient, Role, DepartmentType, Designation } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  console.log('Seeding started...')

  // 1️⃣ Create Company
  const company = await prisma.company.upsert({
    where: { code: 'TIKR' },
    update: {},
    create: {
      name: 'Tikr Technologies',
      code: 'TIKR',
      isActive: true,
    },
  })

  // 2️⃣ Create Department (IT)
  const itDepartment = await prisma.department.upsert({
    where: {
      companyId_name: {
        companyId: company.id,
        name: 'IT',
      },
    },
    update: {},
    create: {
      name: 'IT',
      type: DepartmentType.IT,
      companyId: company.id,
    },
  })

  // 3️⃣ Hash password
  const passwordHash: string = await bcrypt.hash('Admin@123', 10)

  // 4️⃣ Create SUPER ADMIN User
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'superadmin@tikr.com' },
    update: {},
    create: {
      email: 'superadmin@tikr.com',
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      companyId: company.id
      // isActive: true,
    },
  })

  // 5️⃣ Create Employee profile
  const superAdminEmployee = await prisma.employee.upsert({
    where: { userId: superAdminUser.id },
    update: {},
    create: {
      userId: superAdminUser.id,
      companyId: company.id,
      departmentId: itDepartment.id,
      name: 'Super Admin',
      designation: Designation.DIRECTOR,
      employeeCode: 'EMP-0001',
      isActive: true,
    },
  })

  // 6️⃣ Assign Department Manager
  await prisma.department.update({
    where: { id: itDepartment.id },
    data: {
      managerId: superAdminEmployee.id,
    },
  })

  console.log('✅ Seeding completed successfully')
  console.log('👤 SUPER ADMIN LOGIN:')
  console.log('📧 Email: superadmin@tikr.com')
  console.log('🔑 Password: Admin@123')
}

main()
  .catch((error: unknown) => {
    console.error('❌ Seed error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
