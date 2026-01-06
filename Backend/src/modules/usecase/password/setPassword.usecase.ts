import bcrypt from "bcrypt";
import { Status } from "@prisma/client";
import { UserRepository } from "../../repository/auth/user.repository";

export class SetPasswordUsecase {
  constructor(private userRepo: UserRepository) {}

  async execute(
    user: any,
    otp: string,
    currentPassword: string,
    newPassword: string
  ) {
    // 1️⃣ OTP checks
    if (!user.otp || !user.otpExpiry) {
      throw new Error("OTP not found");
    }

    if (user.otpExpiry < new Date()) {
      throw new Error("OTP expired");
    }

    const otpValid = await bcrypt.compare(otp, user.otp);
    if (!otpValid) {
      throw new Error("Invalid OTP");
    }

    // 2️⃣ Temporary password check
    const tempPasswordValid = await bcrypt.compare(
      currentPassword,
      user.tempPassword
    );

    if (!tempPasswordValid) {
      throw new Error("Invalid temporary password");
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update user
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
