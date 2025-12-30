import { Request, Response } from "express";
import { UserRepository } from "../../repository/auth/user.repository";
import { InviteEmployeeUsecase } from "../../usecase/employees/inviteEmployee.usecase";
import { SetPasswordUsecase } from "../../usecase/password/setPassword.usecase";
import { LoginUsecase } from "../../usecase/auth/login.usecase";
import { UpdateCredentialsUsecase } from "../../usecase/auth/update.credentials.usecase";
import { Role } from "@prisma/client";
import { SendEmailUseCase } from "../../usecase/email/sendEmail.usecase";
import { NodemailerService } from "../../repository/email/nodemailer.service";
import { prisma } from "../../../config/db";
import { UpdatePasswordUsecase } from "../../usecase/auth/updatePassword.usecase";
import { CreateSuperAdminUsecase } from "../../usecase/super_admin/create.superAdmin.usecase";

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
      user: {
        id: number;
        role: Role;
      };
    }
  }
}
export class UserController {

  async createSuperAdmin(req: Request, res: Response) {
    try {
      const usecase = new CreateSuperAdminUsecase();
      const user = await usecase.execute(req.body);

      res.status(201).json({
        message: "Super Admin created successfully",
        user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async inviteEmployee(req: Request, res: Response) {
    try {
      // 🔒 AUTH REQUIRED
      const inviter = req.user;
      console.log('inviter----', inviter);

      const allowedRoles = new Set<Role>([
        Role.SUPER_ADMIN,
        Role.ADMIN,
      ]);

      if (!allowedRoles.has(inviter.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const {
        email,
        firstName,
        lastName,
        phone,
        designation,
        role: invitedRole,
      } = req.body;

      if (
        !email ||
        !firstName ||
        !lastName ||
        !phone ||
        !designation ||
        !invitedRole
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (!Object.values(Role).includes(invitedRole)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      await inviteEmployeeUsecase.execute(inviter.role, {
        email,
        firstName,
        lastName,
        phone,
        designation,
        role: invitedRole,
      });

      return res
        .status(201)
        .json({ message: "Invitation email sent successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const usecase = new LoginUsecase(userRepo);
    const result = await usecase.execute(email, password);
    res.json(result);
  };

  async updatePassword(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { newPassword } = req.body;
      const targetUserId = Number(req.params.id);

      if (isNaN(targetUserId)) {
        return res.status(400).json({ error: "Invalid User id" });
      }

      if (!newPassword) {
        return res.status(400).json({ error: "New password is required" });
      }

      const usecase = new UpdatePasswordUsecase(userRepo);

      const result = await usecase.execute(targetUserId, newPassword);

      return res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCredentials(req: Request, res: Response) {

    // 🔐 Logged-in user (from JWT)
    const loggedInUserId = req.user.id;


    if (!loggedInUserId) {
      console.log("LoggedInUser: ", req.user.id)
      console.log("Token user: ", req.user);
      console.log("Params id:", req.params.id);
      console.log("Body:", req.body);
      return res.status(401).json({
        error: "Unauthorized hhhh"
      });
    }

    // 🆔 Target user id (from params → string)
    const paramId = req.params.id;

    if (!paramId) {
      return res.status(400).json({
        error: "User id param is required"
      });
    }

    // ✅ Convert string → number
    const userId = Number(paramId);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user id"
      });
    }
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized with admin code." })
    }

    const usecase = new UpdateCredentialsUsecase(userRepo);
    const user = await usecase.execute(userId, req.body);
    return res.json(user);

  }
}



