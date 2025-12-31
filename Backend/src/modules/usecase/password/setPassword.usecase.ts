import bcrypt from "bcrypt";
import { UserRepository } from "../../repository/auth/user.repository";
import { Status } from "@prisma/client";

export class SetPasswordUsecase {
  constructor(private userRepo: UserRepository) {}

  async execute(token: string, newPassword: string) {
    const user = await this.userRepo.findByInviteToken(token);

    if (!user) {
      throw new Error("Invalid or expired link");
    }

    if (user.inviteExpiry && user.inviteExpiry < new Date()) {
      throw new Error("Invite link expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepo.update(user.id, {
      password: hashedPassword,
      status: Status.ACTIVE,
      isActive: true,
      inviteToken: null,
      inviteExpiry: null,
    });

    return { message: "Password set successfully" };
  }
}
