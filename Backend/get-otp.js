// Quick script to get OTP and temp password from database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getOTP() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'aastha@mailinator.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        otp: true,
        tempPassword: true,
        status: true,
        otpExpiry: true
      }
    });

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('\n✅ User Found!');
    console.log('=====================================');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.firstName, user.lastName);
    console.log('📊 Status:', user.status);
    console.log('=====================================');
    console.log('\n🔐 CREDENTIALS FOR SET-PASSWORD:');
    console.log('=====================================');
    console.log('OTP (hashed):', user.otp);
    console.log('Temp Password (hashed):', user.tempPassword);
    console.log('OTP Expiry:', user.otpExpiry);
    console.log('=====================================');
    
    console.log('\n⚠️  NOTE: OTP and password are HASHED in database!');
    console.log('You need the ORIGINAL values from the email.');
    console.log('\n💡 SOLUTION: Check backend logs when user was created.');
    console.log('Or use the resend-otp endpoint to get new credentials.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getOTP();
