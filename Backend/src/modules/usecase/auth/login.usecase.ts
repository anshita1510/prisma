
import { UserRepository } from "../../repository/auth/user.repository";
import { comparePassword } from "../../../shared/utils/password";
import { generateAuthToken } from "../../../shared/utils/jwt";
import { Status } from "@prisma/client";

export class LoginUsecase {
  constructor(private userRepo: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !user.password) {
      throw new Error("Invalid email or password hello");
    }

    if (user.status === Status.PENDING) {
      throw new Error("Please set your password");
    }

    if(!user.isActive){
      throw new Error("Accoount disabled");
    }

    if (user.status === Status.INACTIVE) {
      throw new Error("Account is inactive");
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password wow" );
    }

    const token = generateAuthToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const { password: _, ...safeUser } = user;

    return { user: safeUser, token };
  }
}
