const nodemailer = require('nodemailer');
require('dotenv').config();

async function testRealEmail() {
  console.log('🧪 Testing email to your actual email address...');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Verify connection first
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Send test email to the admin email (the one you're likely using)
    const testEmail = 'singladeepak519@gmail.com'; // Your admin email
    
    console.log(`📧 Sending test email to: ${testEmail}`);
    const result = await transporter.sendMail({
      from: `"Tikr Team" <${process.env.SMTP_USER}>`,
      to: testEmail,
      subject: 'Test: Admin User Creation Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🧪 Email Service Test</h2>
          <p>This is a test email to verify that the email service is working correctly for admin user creation.</p>
          
          <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <ul>
              <li><strong>Sent at:</strong> ${new Date().toISOString()}</li>
              <li><strong>From:</strong> ${process.env.SMTP_USER}</li>
              <li><strong>To:</strong> ${testEmail}</li>
              <li><strong>Purpose:</strong> Verify admin user creation email functionality</li>
            </ul>
          </div>
          
          <p><strong>If you receive this email, the email service is working correctly!</strong></p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test email from your Tikr application.
          </p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    console.log('');
    console.log('🔍 Please check your email (including spam folder) for the test message.');
    console.log('📧 Email sent to:', testEmail);

  } catch (error) {
    console.error('❌ Email test failed:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    
    if (error.code === 'EAUTH') {
      console.error('');
      console.error('🚨 AUTHENTICATION ERROR:');
      console.error('   - Gmail credentials are incorrect');
      console.error('   - Make sure you are using an App Password, not your regular Gmail password');
      console.error('   - Check that 2-factor authentication is enabled on your Gmail account');
    }
  }
}

testRealEmail();