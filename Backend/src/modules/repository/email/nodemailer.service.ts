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
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}

      // from: process.env.SMTP_FROM,
// 