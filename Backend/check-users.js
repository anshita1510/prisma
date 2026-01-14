const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isActive: true,
        password: true,
        tempPassword: true,
        authProvider: true
      },
      take: 10
    });
    
    console.log('=== USERS IN DATABASE ===');
    console.log(`Total users: ${users.length}\n`);
    
    users.forEach(user => {
      console.log({
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
        hasPassword: !!user.password,
        hasTempPassword: !!user.tempPassword,
        authProvider: user.authProvider
      });
      console.log('---');
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkUsers();
