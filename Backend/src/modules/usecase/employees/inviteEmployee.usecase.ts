// import { UserRepository } from "../../repository/auth/user.repository";
// import { generateVerificationToken } from "../../../shared/utils/jwt";
// import bcrypt from "bcrypt";
// import crypto from "crypto";
// import { SendEmailUseCase } from "../../usecase/email/sendEmail.usecase";
// import { inviteEmployeeTemplate } from "../../../shared/emails/templates/inviteEmployee.template";
// import { Role } from "@prisma/client";
// import { InviteEmployeeDTO } from "../../dto/employees/invite.employee.dto";

// export class InviteEmployeeUsecase {

//     constructor(private userRepo: UserRepository, private sendEmailUseCase: SendEmailUseCase) {}
//     async execute(
//         inviterRole: Role,
//         payload: InviteEmployeeDTO
//     ) {
//         const { email, role: invitedRole}= payload;

//         if (inviterRole === Role.EMPLOYEE || inviterRole === Role.MANAGER){
//             throw new Error("You are not authorized to invite users");
//         }

//         if(inviterRole === Role.ADMIN && invitedRole === Role.EMPLOYEE){
//             throw new Error("Admin can invite only Employees");
//         }

//         if( inviterRole === Role.SUPER_ADMIN && invitedRole === Role.SUPER_ADMIN){
//             throw new Error(" Super Admin already exists");
//         }

//         //Step 2: Check agar email pehle se registered hai
//         const existing = await this.userRepo.findByEmail(email);
//         if (existing) {
//             throw new Error("Email already registered");
//         }

//         //Step 3: Random password generate karna (plain text)
//         const plainPassword = crypto.randomBytes(8).toString("hex");

//         //Step 4: Password ko hash karna (DB me hash hi store hoga)
//         const hashedPassword = await bcrypt.hash(plainPassword, 10);

//         // Step 5: Email verification / set-password token generate
//         const token = generateVerificationToken(email);

//         // Step 6: Token expiry (1 hour)
//         const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

//         //  Step 7: User create karna DB me (inactive / pending state)

//         const user = await this.userRepo.create({
//             ...payload,
//             password: hashedPassword,
//             status: "PENDING",         // jab tak verify nahi karta
//             isActive: false,
//             verificationToken: token,
//             tokenExpiry,
//         });

//         console.log("Created User: ", user);
//         await this.sendEmailUseCase.execute({
//             to: user.email,
//             subject: "You're invited to join our platform",
//             html: inviteEmployeeTemplate({
//                 firstName: payload.firstName,
//                 email: user.email,
//                 tempPassword: plainPassword, // ⚠️ only in email
//             }),
//         });
//         return user;
//     }
// }




import crypto from "crypto";
import { UserRepository } from "../../repository/auth/user.repository";
import { SendEmailUseCase } from "../email/sendEmail.usecase";
import { Role, Status } from "@prisma/client";

export class InviteEmployeeUsecase {
    constructor(
        private userRepo: UserRepository,
        private sendEmailUseCase: SendEmailUseCase
    ) { }

    async execute(
        inviterRole: Role,
        data: {
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            designation: string;
            role: Role;
        }
    ) {
        // 🔒 Role guard
        const allowedRoles = new Set<Role>([
            Role.SUPER_ADMIN,
            Role.ADMIN,
        ]);

        if (!allowedRoles.has(inviterRole)) {
            throw new Error("Unauthorized");
        }


        // ❌ Prevent inviting SUPER_ADMIN
        if (data.role === Role.SUPER_ADMIN) {
            throw new Error("Cannot invite Super Admin");
        }

        if (
            inviterRole !== Role.SUPER_ADMIN &&
            inviterRole !== Role.ADMIN
        ) {
            throw new Error("Unauthorized");
        }

        // ❌ Email already exists
        const existing = await this.userRepo.findByEmail(data.email);
        if (existing) throw new Error("User already exists");

        // 🔑 Generate invite token
        const inviteToken = crypto.randomBytes(32).toString("hex");
        const inviteExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hrs

        // 🧑 Create PENDING user
        await this.userRepo.create({
            ...data,
            password: null,
            status: Status.PENDING,
            inviteToken,
            inviteExpiry,
        });

        // 📩 Send invite email
        const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;

        await this.sendEmailUseCase.execute({
            to: data.email,
            subject: "You're invited",
            html: `
        <h2>Welcome ${data.firstName}</h2>
        <p>You are invited as <b>${data.role}</b>.</p>
        <p>
          <a href="${inviteLink}">
            Click here to set your password
          </a>
        </p>
        <p>This link expires in 24 hours.</p>
      `,
        });
    }
}

