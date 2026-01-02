
import crypto from "crypto";
import bcrypt from "bcrypt";
import { UserRepository } from "../../repository/auth/user.repository";
import { SendEmailUseCase } from "../email/sendEmail.usecase";
import { Role, Status } from "@prisma/client";
import { prisma } from "../../../config/db";

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
    const allowedRoles: Role[] = [Role.SUPER_ADMIN, Role.ADMIN];

    if (!allowedRoles.includes(inviterRole)) {
      throw new Error("Unauthorized");
    }

    /* 🚫 Prevent SUPER_ADMIN creation */
    if (data.role === Role.SUPER_ADMIN) {
      throw new Error("Cannot invite Super Admin");
    }

    /* 👤 Check existing user */
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    /* ⏳ Tokens & Expiry */
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);
    const otpExpiry = new Date(Date.now() + 30 * 60 * 1000);

    /* 🧑 CREATE USER (FULLY FILLED ✅) */
    const user = await this.userRepo.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      designation: data.designation,
      role: data.role,
      status: Status.PENDING,
      isActive: false,
      tempPassword: hashedTempPassword,
      otp: hashedOtp,
      otpExpiry: otpExpiry,
      inviteToken,
      inviteExpiry,
    });

    /* 🔐 Password setup record */
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tempPassword: hashedTempPassword,  // already set in create, but safe
        otp: hashedOtp,
        otpExpiry: otpExpiry,
      },
    });

    /* 📧 Send invite email */
    await this.sendEmailUseCase.execute({
      to: data.email,
      subject: "You're Invited to Join the Platform",
      html: `
        <h2>Welcome ${data.firstName}!</h2>
        <p>You have been invited to join our platform.</p>

        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p><strong>OTP:</strong> ${rawOtp}</p>

        <p>This OTP is valid for 30 minutes.</p>

        <br />
        <p>Thanks,<br/>Team Tikr</p>
      `,
    });

    return {
      message: "Invitation sent successfully",
      email: data.email,
    };
  }
}

