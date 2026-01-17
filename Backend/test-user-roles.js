/**
 * Test script to check user roles in the database
 * Run with: node test-user-roles.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserRoles() {
  console.log('='.repeat(60));
  console.log('👥 User Roles Check');
  console.log('='.repeat(60));

  try {
    // Get all users with their roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        authProvider: true,
        googleId: true,
        isActive: true,
        status: true,
      },
      orderBy: {
        role: 'asc',
      },
    });

    if (users.length === 0) {
      console.log('\n❌ No users found in database');
      return;
    }

    console.log(`\n📊 Found ${users.length} users:\n`);

    // Group by role
    const roleGroups = {
      SUPER_ADMIN: [],
      ADMIN: [],
      MANAGER: [],
      EMPLOYEE: [],
    };

    users.forEach(user => {
      if (roleGroups[user.role]) {
        roleGroups[user.role].push(user);
      }
    });

    // Display by role
    Object.entries(roleGroups).forEach(([role, users]) => {
      if (users.length > 0) {
        console.log(`\n🔹 ${role} (${users.length}):`);
        console.log('-'.repeat(60));
        users.forEach(user => {
          const authMethod = user.googleId ? '🔐 Google OAuth' : '🔑 Local Auth';
          const status = user.isActive ? '✅ Active' : '❌ Inactive';
          console.log(`  ${authMethod} | ${status}`);
          console.log(`  📧 ${user.email}`);
          console.log(`  👤 ${user.firstName} ${user.lastName}`);
          console.log(`  🆔 ID: ${user.id}`);
          console.log('');
        });
      }
    });

    // Show OAuth redirect mapping
    console.log('\n📍 OAuth Redirect Mapping:');
    console.log('-'.repeat(60));
    console.log('  SUPER_ADMIN → /superAdmin');
    console.log('  ADMIN       → /admin');
    console.log('  MANAGER     → /manager');
    console.log('  EMPLOYEE    → /user');
    console.log('');

    // Test specific email (if provided)
    const testEmail = process.argv[2];
    if (testEmail) {
      console.log(`\n🔍 Testing email: ${testEmail}`);
      console.log('-'.repeat(60));
      
      const user = await prisma.user.findUnique({
        where: { email: testEmail.toLowerCase() },
      });

      if (user) {
        console.log(`✅ User found!`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Auth: ${user.authProvider}`);
        console.log(`   Active: ${user.isActive}`);
        
        const redirectMap = {
          SUPER_ADMIN: '/superAdmin',
          ADMIN: '/admin',
          MANAGER: '/manager',
          EMPLOYEE: '/user',
        };
        
        console.log(`   Will redirect to: ${redirectMap[user.role] || '/dashboard'}`);
      } else {
        console.log(`❌ User not found`);
        console.log(`   Will be created as EMPLOYEE on first Google login`);
        console.log(`   Will redirect to: /user`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Check complete!');
    console.log('='.repeat(60));
    console.log('\n💡 Usage: node test-user-roles.js [email@example.com]');
    console.log('   Example: node test-user-roles.js admin@tikr.com\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRoles();
