import { Request, Response } from "express";
import { UserRepository } from "../../repository/auth/user.repository";
import { InviteEmployeeUsecase } from "../../usecase/employees/inviteEmployee.usecase";
import { SetPasswordUsecase } from "../../usecase/password/setPassword.usecase";
import { LoginUsecase } from "../../usecase/auth/login.usecase";
import { UpdateCredentialsUsecase } from "../../usecase/auth/update.credentials.usecase";
import { UpdatePasswordUsecase } from "../../usecase/auth/updatePassword.usecase";
import { CreateSuperAdminUsecase } from "../../usecase/super_admin/create.superAdmin.usecase";
import { SendEmailUseCase } from "../../usecase/email/sendEmail.usecase";
import { NodemailerService } from "../../repository/email/nodemailer.service";
import { Role } from "@prisma/client";

const userRepo = new UserRepository();
const emailService = new NodemailerService();
const sendEmailUseCase = new SendEmailUseCase(emailService);
const inviteEmployeeUsecase = new InviteEmployeeUsecase(
  userRepo,
  sendEmailUseCase
);

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
      };
    }
  }
}

export class UserController {

  /** ✅ CREATE SUPER ADMIN (ONLY ONE ALLOWED) */
  async createSuperAdmin(req: Request, res: Response) {
    try {
      const usecase = new CreateSuperAdminUsecase();
      const user = await usecase.execute(req.body);

      return res.status(201).json({
        message: "Super Admin created successfully",
        user,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /** ✅ INVITE EMPLOYEE */
  async inviteEmployee(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const allowedRoles = new Set<Role>([
        Role.SUPER_ADMIN,
        Role.ADMIN,
      ]);

      if (!allowedRoles.has(req.user.role)) {
        return res.status(403).json({ error: "hhhhh" });
      }


      const { email, firstName, lastName, phone, designation, role } = req.body;

      if (!email || !firstName || !lastName || !phone || !designation || !role) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (!Object.values(Role).includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      await inviteEmployeeUsecase.execute(req.user.role, {
        email,
        firstName,
        lastName,
        phone,
        designation,
        role,
      });

      return res.status(201).json({
        message: "Invitation email sent successfully",
      });

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /** ✅ LOGIN */
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

  /** ✅ UPDATE PASSWORD (SELF OR SUPER ADMIN) */
  async updatePassword(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorizedd" });
      }

      const targetUserId = Number(req.params.id);
      const { newPassword } = req.body;

      if (!newPassword || isNaN(targetUserId)) {
        return res.status(400).json({ error: "Invalid input" });
      }

      if (
        req.user.id !== targetUserId &&
        req.user.role !== Role.SUPER_ADMIN
      ) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const usecase = new UpdatePasswordUsecase(userRepo);
      const result = await usecase.execute(targetUserId, newPassword);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /** ✅ SET PASSWORD FROM INVITE */
  async setPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: "Token and password required" });
      }

      const usecase = new SetPasswordUsecase(userRepo);
      const result = await usecase.execute(token, password);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /** ✅ UPDATE USER CREDENTIALS (ADMIN ONLY)hhhhh */
  async updateCredentials(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorizedddd" });
      }

      if (req.user.role !== Role.ADMIN) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const userId = Number(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
      }

      const usecase = new UpdateCredentialsUsecase(userRepo);
      const user = await usecase.execute(userId, req.body);

      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
