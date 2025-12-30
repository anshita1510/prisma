import { UserRepository } from "../../repository/auth/user.repository";
import { comparePassword } from "../../../shared/utils/password";
import { generateAuthToken } from "../../../shared/utils/jwt";
import { Status } from "@prisma/client";

export class LoginUsecase {
  constructor(private userRepo: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !user.password) {
      throw new Error("Invalid email or password");
    }

    if (user.status !== Status.ACTIVE) {
      throw new Error("Account not active");
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateAuthToken({
      id: user.id,
      role: user.role,
      email: user.email, // ✅ or remove if unused
    });

    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  }
}
