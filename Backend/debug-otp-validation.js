// Debug script to test OTP validation
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function debugOTPValidation() {
  try {
    const email = 'Deepak@mailinator.com';
    const otpFromEmail = '492820';
    const tempPasswordFromEmail = '7c68e4057576';

    console.log('\n🔍 DEBUGGING OTP VALIDATION');
    console.log('=====================================');
    console.log('📧 Email:', email);
    console.log('🔢 OTP from email:', otpFromEmail);
    console.log('🔑 Temp password from email:', tempPasswordFromEmail);
    console.log('=====================================\n');

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        otp: true,
        tempPassword: true,
        status: true,
        otpExpiry: true,
        createdAt: true
      }
    });

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('✅ User Found in Database:');
    console.log('   ID:', user.id);
    console.log('   Name:', user.firstName, user.lastName);
    console.log('   Status:', user.status);
    console.log('   Created:', user.createdAt);
    console.log('   OTP Expiry:', user.otpExpiry);
    console.log('   OTP Expired?', user.otpExpiry < new Date() ? '❌ YES' : '✅ NO');
    console.log('\n=====================================\n');

    // Test OTP validation
    console.log('🧪 Testing OTP Validation:');
    console.log('   Plain OTP:', otpFromEmail);
    console.log('   Hashed OTP in DB:', user.otp);
    
    if (!user.otp) {
      console.log('   ❌ No OTP in database!');
    } else {
      const otpValid = await bcrypt.compare(otpFromEmail, user.otp);
      console.log('   bcrypt.compare() result:', otpValid ? '✅ VALID' : '❌ INVALID');
      
      if (!otpValid) {
        console.log('\n   🔍 Trying to hash the plain OTP to see what it should be:');
        const testHash = await bcrypt.hash(otpFromEmail, 10);
        console.log('   New hash of same OTP:', testHash);
        console.log('   ⚠️  Note: bcrypt generates different hashes each time!');
      }
    }

    console.log('\n=====================================\n');

    // Test temp password validation
    console.log('🧪 Testing Temp Password Validation:');
    console.log('   Plain temp password:', tempPasswordFromEmail);
    console.log('   Hashed temp password in DB:', user.tempPassword);
    
    if (!user.tempPassword) {
      console.log('   ❌ No temp password in database!');
    } else {
      const tempPasswordValid = await bcrypt.compare(tempPasswordFromEmail, user.tempPassword);
      console.log('   bcrypt.compare() result:', tempPasswordValid ? '✅ VALID' : '❌ INVALID');
      
      if (!tempPasswordValid) {
        console.log('\n   🔍 Trying to hash the plain temp password:');
        const testHash = await bcrypt.hash(tempPasswordFromEmail, 10);
        console.log('   New hash of same password:', testHash);
        console.log('   ⚠️  Note: bcrypt generates different hashes each time!');
      }
    }

    console.log('\n=====================================\n');

    // Check if there's a mismatch in what was stored
    console.log('💡 DIAGNOSIS:');
    if (!user.otp || !user.tempPassword) {
      console.log('   ❌ Missing OTP or temp password in database');
      console.log('   🔧 FIX: User needs to be re-invited or use resend-otp');
    } else if (user.otpExpiry < new Date()) {
      console.log('   ❌ OTP has expired');
      console.log('   🔧 FIX: Use resend-otp endpoint to get new OTP');
    } else {
      console.log('   🤔 OTP and temp password exist and not expired');
      console.log('   🔍 Testing if the values from email match database...');
      
      const otpMatch = await bcrypt.compare(otpFromEmail, user.otp);
      const tempMatch = await bcrypt.compare(tempPasswordFromEmail, user.tempPassword);
      
      if (!otpMatch) {
        console.log('   ❌ OTP from email does NOT match database hash');
        console.log('   🔧 POSSIBLE CAUSES:');
        console.log('      1. Wrong OTP value copied from email');
        console.log('      2. OTP was regenerated after email was sent');
        console.log('      3. Database was modified manually');
      }
      
      if (!tempMatch) {
        console.log('   ❌ Temp password from email does NOT match database hash');
        console.log('   🔧 POSSIBLE CAUSES:');
        console.log('      1. Wrong temp password copied from email');
        console.log('      2. Temp password was regenerated after email was sent');
        console.log('      3. Database was modified manually');
      }
      
      if (otpMatch && tempMatch) {
        console.log('   ✅ Both OTP and temp password are CORRECT!');
        console.log('   🤔 The set-password endpoint should work...');
      }
    }

    console.log('\n=====================================\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugOTPValidation();
