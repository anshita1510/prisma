import bcrypt from "bcrypt";
import { prisma } from "../../../config/db";
import { Status } from "@prisma/client";
import { UserRepository } from "../../repository/auth/user.repository";

export class SetPasswordUsecase {

  constructor(private userRepo: UserRepository) { }


  // async execute(token: string, newPassword: string) {
    // const user = await prisma.user.findFirst({
    //   where: {
    //     inviteToken: token,
    //     inviteExpiry: { gt: new Date() },
    //   },
    // });

    async execute(token: string, newPassword: string) {
      const user = await this.userRepo.findByInviteToken(token);



      if (!user) {
        throw new Error("Invalid or expired link");
      }

      if (user.inviteExpiry && user.inviteExpiry < new Date()) {
        throw new Error("Token required");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepo.update(
        user.id, {
        password: hashedPassword,
        status: Status.ACTIVE,
        isActive: true,
        inviteToken: null,
        inviteExpiry: null,
      },
      );


      return { message: "Password set successfully" };
    }
  }
