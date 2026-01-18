import nodemailer from "nodemailer";
import { EmailService } from "../../domain/email/email.service";
import { SendEmailDTO } from "../../dto/email/sendEmail.dto"; 

export class NodemailerService implements EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      connectionTimeout: 5000, // 5 seconds connection timeout
      greetingTimeout: 5000,   // 5 seconds greeting timeout
      socketTimeout: 10000,    // 10 seconds socket timeout
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(data: SendEmailDTO): Promise<void> {
    try {
      console.log('📧 Attempting to send email to:', data.to);
      console.log('📧 SMTP Configuration:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? '***configured***' : 'NOT SET',
        pass: process.env.SMTP_PASS ? '***configured***' : 'NOT SET'
      });
      
      const mailOptions = {
        from: `"Tikr Team" <${process.env.SMTP_USER}>`,
        to: data.to,
        subject: data.subject,
        html: data.html,
      };
      
      console.log('📧 Sending email with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', {
        messageId: result.messageId,
        response: result.response,
        to: data.to
      });
      
    } catch (error: any) {
      console.error('❌ Email sending failed:', {
        error: error.message,
        code: error.code,
        command: error.command,
        to: data.to
      });
      
      // Log specific SMTP errors
      if (error.code === 'EAUTH') {
        console.error('❌ SMTP Authentication failed - check credentials');
      } else if (error.code === 'ECONNECTION') {
        console.error('❌ SMTP Connection failed - check host/port');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('❌ SMTP Timeout - check network connection');
      }
      
      // Don't throw the error - just log it so user creation can continue
      console.log('⚠️ Continuing without email notification...');
    }
  }
}