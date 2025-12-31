import { Request, Response } from "express";
import { NodemailerService } from "../../repository/email/nodemailer.service";
import { SendEmailUseCase } from "../../usecase/email/sendEmail.usecase";

export const sendEmailController = async (
    req: Request,
    res: Response
) => {
    const { to, subject, html } = req.body;

    const emailService = new NodemailerService();
    const sendEmailUseCase = new SendEmailUseCase(emailService);

    await sendEmailUseCase.execute({
        to,
        subject,
        html,
    });
    return res.status(200).json({
        message: " Email sent successfully",
    })

}