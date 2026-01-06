import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../../config/db";
import { Role, Status } from "@prisma/client"; // Import both for clarity

import { UserRepository } from "../../repository/auth/user.repository";
import { InviteEmployeeUsecase } from "../../usecase/employees/inviteEmployee.usecase";
import { SetPasswordUsecase } from "../../usecase/password/setPassword.usecase";
import { LoginUsecase } from "../../usecase/auth/login.usecase";
import { UpdateCredentialsUsecase } from "../../usecase/auth/update.credentials.usecase";
import { UpdatePasswordUsecase } from "../../usecase/auth/updatePassword.usecase";
import { CreateSuperAdminUsecase } from "../../usecase/super_admin/create.superAdmin.usecase";
import { SendEmailUseCase } from "../../usecase/email/sendEmail.usecase";
import { NodemailerService } from "../../repository/email/nodemailer.service";

/* -------------------------------------------------------------------------- */
/*                               INITIALIZATION                               */
/* -------------------------------------------------------------------------- */

const userRepo = new UserRepository();
const emailService = new NodemailerService();
const sendEmailUseCase = new SendEmailUseCase(emailService);
const inviteEmployeeUsecase = new InviteEmployeeUsecase(userRepo, sendEmailUseCase);

/* -------------------------------------------------------------------------- */
/*                         EXPRESS REQUEST AUGMENTATION                        */
/* -------------------------------------------------------------------------- */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
      };
      invitedUser?: any; // You can tighten this later to User type
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                            ROLE HELPER FUNCTION                            */
/* -------------------------------------------------------------------------- */

// Fixed: Compare using string values instead of enum type
export function isAdminRole(role: Role): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
  // OR more explicitly:
  // return [Role.ADMIN, Role.SUPER_ADMIN].includes(role); // This also works!
}

/* -------------------------------------------------------------------------- */
/*                                CONTROLLER                                  */
/* -------------------------------------------------------------------------- */

export class UserController {
  /* ================= CREATE SUPER ADMIN ================= */
  async createSuperAdmin(req: Request, res: Response) {
    try {
      const usecase = new CreateSuperAdminUsecase();
      const user = await usecase.execute(req.body);
      console.log('Auth: ', req.body.auth);

      return res.status(201).json({
        message: "Super Admin created successfully",
        user,

      });

    } catch (error: any) {

      return res.status(400).json({ error: error.message });
    }

  }

  /* ================= INVITE EMPLOYEE ================= */
  async inviteEmployee(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!isAdminRole(req.user.role)) {
        return res.status(403).json({ error: "Forbidden: Admin access required" });
      }

      const { email, firstName, lastName, phone, designation, role } = req.body;

      if (!email || !firstName || !lastName || !phone || !designation || !role) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Validate role is a valid enum value (safe check)
      if (!Object.values(Role).includes(role as Role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      await inviteEmployeeUsecase.execute(req.user.role, {
        email,
        firstName,
        lastName,
        phone,
        designation,
        role: role as Role,
      });
      console.log('Auth is here: ', req.body.authorization);
      console.log("REQ.USER 👉", req.user);

      return res.status(201).json({
        message: "Invitation email sent successfully",
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /* ================= LOGIN ================= */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const usecase = new LoginUsecase(userRepo);
      const result = await usecase.execute(email, password);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  /* ================= UPDATE PASSWORD (SELF OR SUPER_ADMIN) ================= */
  async updatePassword(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const targetUserId = Number(req.params.id);
      const { newPassword } = req.body;

      if (!newPassword || isNaN(targetUserId)) {
        return res.status(400).json({ error: "Invalid input" });
      }

      if (req.user.id !== targetUserId && req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }

      const usecase = new UpdatePasswordUsecase(userRepo);
      const result = await usecase.execute(targetUserId, newPassword);

      return res.json({ message: "Password updated successfully", result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /* ================= SET PASSWORD FROM INVITE ================= */
  async setPassword(req: Request, res: Response) {
    try {
      const user = req.invitedUser;

      if (!user) {
        return res.status(401).json({ error: "Invalid or expired invite token" });
      }

      const { otp, currentPassword, newPassword } = req.body;

      if (!otp || !currentPassword || !newPassword) {
        return res.status(400).json({
          error: "OTP, temporary password, and new password are required",
        });
      }

      const usecase = new SetPasswordUsecase(userRepo);
      await usecase.execute(user, otp.trim(), currentPassword, newPassword);

      return res.json({
        message: "Password set successfully. You can now log in.",
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /* ================= RESEND OTP ================= */
  async resendOtp(req: Request, res: Response) {
    try {
      const user = req.invitedUser;

      if (!user || user.status !== Status.PENDING) {
        return res.status(400).json({ error: "Invalid or expired invite" });
      }

      const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(rawOtp, 10);
      const otpExpiry = new Date(Date.now() + 30 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp: hashedOtp,
          otpExpiry: otpExpiry
        },
      });

      await sendEmailUseCase.execute({
        to: user.email,
        subject: "Your New Password Setup OTP",
        html: `
          <h3>New OTP for Account Setup</h3>
          <p>Use this OTP to complete your password setup:</p>
          <h2 style="color:#e53e3e; letter-spacing: 4px;">${rawOtp}</h2>
          <p><strong>Valid for 30 minutes only.</strong></p>
          <p>If you didn't request this, ignore this email.</p>
        `,
      });

      return res.json({ message: "New OTP sent successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to resend OTP" });
    }
  }

  /* ================= UPDATE USER CREDENTIALS (ADMIN ONLY) ================= */
  async updateCredentials(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const userId = Number(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const usecase = new UpdateCredentialsUsecase(userRepo);
      const updatedUser = await usecase.execute(userId, req.body);

      return res.json({
        message: "User credentials updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}