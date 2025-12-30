import { UserRepository } from "../../repository/auth/user.repository";
import { generateVerificationToken } from "../../../shared/utils/jwt";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { SendEmailUseCase } from "../../usecase/email/sendEmail.usecase";
import { inviteEmployeeTemplate } from "../../../shared/emails/templates/inviteEmployee.template";
import { Role } from "@prisma/client";
import { InviteEmployeeDTO } from "../../dto/employees/invite.employee.dto";

export class InviteEmployeeUsecase {

    constructor(private userRepo: UserRepository, private sendEmailUseCase: SendEmailUseCase) {
    }
    async execute(
        inviterRole: Role,
        payload: InviteEmployeeDTO
    ) {
        const { email, role: invitedRole}= payload;

        if (inviterRole === Role.EMPLOYEE || inviterRole === Role.MANAGER){
            throw new Error("You are not authorized to invite users");
        }

        if(inviterRole === Role.ADMIN && invitedRole === Role.EMPLOYEE){
            throw new Error("Admin can invite only Employees");
        }

        if( inviterRole === Role.SUPER_ADMIN && invitedRole === Role.SUPER_ADMIN){
            throw new Error(" Super Admin already exists");
        }

        //Step 2: Check agar email pehle se registered hai
        const existing = await this.userRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email already registered");
        }

        //Step 3: Random password generate karna (plain text)
        const plainPassword = crypto.randomBytes(8).toString("hex");

        //Step 4: Password ko hash karna (DB me hash hi store hoga)
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Step 5: Email verification / set-password token generate
        const token = generateVerificationToken(email);

        // Step 6: Token expiry (1 hour)
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

        //  Step 7: User create karna DB me (inactive / pending state)

        const user = await this.userRepo.create({
            ...payload,
            password: hashedPassword,
            status: "PENDING",         // jab tak verify nahi karta
            isActive: false,
            verificationToken: token,
            tokenExpiry,
        });

        console.log("Created User: ", user);
        await this.sendEmailUseCase.execute({
            to: user.email,
            subject: "You're invited to join our platform",
            html: inviteEmployeeTemplate({
                firstName: payload.firstName,
                email: user.email,
                tempPassword: plainPassword, // ⚠️ only in email
            }),
        });
        return user;
    }
}
