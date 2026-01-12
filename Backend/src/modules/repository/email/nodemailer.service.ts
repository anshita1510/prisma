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
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(data: SendEmailDTO): Promise<void> {
    try {
      console.log('📧 Attempting to send email to:', data.to);
      
      // Add timeout to prevent hanging
      const emailPromise = this.transporter.sendMail({
        from: process.env.SMTP_USER, // Use SMTP_USER as from address
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
      
      // Set a 10-second timeout for email sending
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email timeout after 10 seconds')), 10000);
      });
      
      await Promise.race([emailPromise, timeoutPromise]);
      console.log('✅ Email sent successfully to:', data.to);
      
    } catch (error: any) {
      console.error('❌ Email sending failed:', error.message);
      // Don't throw the error - just log it so user creation can continue
      console.log('⚠️ Continuing without email notification...');
    }
  }
}