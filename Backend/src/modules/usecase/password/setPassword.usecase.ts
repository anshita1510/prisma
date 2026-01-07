import bcrypt from "bcrypt";
import { Status } from "@prisma/client";
import { UserRepository } from "../../repository/auth/user.repository";

export class SetPasswordUsecase {
  constructor(private userRepo: UserRepository) { }

  async execute(
    email: string,
    otp: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !user.otp || !user.otpExpiry) {
      throw new Error("Invalid OTP request");
    }

    if (user.otpExpiry < new Date()) {
      throw new Error("OTP expired");
    }

    const otpValid = await bcrypt.compare(otp, user.otp);
    if (!otpValid) {
      throw new Error("Invalid OTP");
    }

    if (!user.tempPassword) {
      throw new Error("Temporary password not set");
    }


    const tempPasswordValid = await bcrypt.compare(
      currentPassword,
      user.tempPassword
    );

    if (!tempPasswordValid) {
      throw new Error("Invalid temporary password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepo.updateUser(user.id, {
      password: hashedPassword,
      tempPassword: null,
      otp: null,
      otpExpiry: null,
      status: Status.ACTIVE,
      isActive: true,
    });
  }
}
