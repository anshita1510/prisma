import { EmailService } from "../../domain/email/email.service";

interface SendEmailDTO{
    to: string;
    subject: string;
    html: string;
}

export class SendEmailUseCase{
    constructor(private emailService: EmailService){}

    async execute(data: SendEmailDTO): Promise<void> {
        await this.emailService.sendEmail(
            data.to,
            data.subject,
            data.html
        );
    } 
}