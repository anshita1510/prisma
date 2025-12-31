import crypto from "crypto";
import bcrypt from "bcrypt";
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

        // ❌ Email already exists
        const existing = await this.userRepo.findByEmail(data.email);
        if (existing) {
            throw new Error("User already exists");
        }

        // 🔑 Generate temporary raw password
        const rawPassword = crypto.randomBytes(6).toString("hex");

        // 🔐 Hash password for DB
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // 🔑 Invite token (for reset password)
        const inviteToken = crypto.randomBytes(32).toString("hex");
        const inviteExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hrs

        // 🧑 Create user
        await this.userRepo.create({
            ...data,
            password: hashedPassword,
            status: Status.PENDING,
            inviteToken,
            inviteExpiry,
            isActive: false,
        });

        // 📩 Invite email
        const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;

        await this.sendEmailUseCase.execute({
            to: data.email,
            subject: "You're invited to join",
            html: `
                <h2>Welcome ${data.firstName}</h2>
                <p>You are invited as <b>${data.role}</b>.</p>

                <p><b>Temporary Password:</b> ${rawPassword}</p>

                <p>
                    Please login using the above password and then set a new password using the link below:
                </p>

                <p>
                    <a href="${inviteLink}">
                        Set New Password
                    </a>
                </p>

                <p>This link expires in 24 hours.</p>
            `,
        });
    }
}
