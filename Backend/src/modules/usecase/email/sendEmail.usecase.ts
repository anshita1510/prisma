import { EmailService } from "../../domain/email/email.service";
import { SendEmailDTO } from "../../dto/email/sendEmail.dto";



export class SendEmailUseCase {
  send(arg0: { to: any; subject: string; html: string; }) {
    throw new Error("Method not implemented.");
  }
  constructor(private readonly emailService: EmailService) {}

  async execute(data: SendEmailDTO): Promise<void> {
    await this.emailService.sendEmail(data);
  }
}