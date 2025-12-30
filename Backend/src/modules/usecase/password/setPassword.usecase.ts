import { UserRepository } from "../../repository/auth/user.repository";
import { verifyToken } from "../../../shared/utils/jwt";
import { hashPassword } from "../../../shared/utils/password";

import bcrypt from "bcrypt";
import { prisma } from "../../../config/db";
import { Status } from "@prisma/client";

export class SetPasswordUsecase {
  async execute(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        inviteToken: token,
        inviteExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired link");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        status: Status.ACTIVE,
        inviteToken: null,
        inviteExpiry: null,
      },
    });

    return { message: "Password set successfully" };
  }
}
