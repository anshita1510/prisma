// src/modules/usecase/password/setPassword.usecase.ts

import bcrypt from "bcrypt";
import { UserRepository } from "../../repository/auth/user.repository";
import { prisma } from "../../../config/db";
import { User } from "@prisma/client";


export class SetPasswordUsecase {
  constructor(private userRepo: UserRepository) {}

  async execute(
    user: User,
    otp: string,
    currentPassword: string,  // temporary password
    newPassword: string
  ) {
    // For now, since we don't store OTP in DB, skip OTP check or add field later
    // Optional: add otp to user model to verify

    // Verify temporary password
    if (!user.password) {
      throw new Error("No temporary password set");
    }

    const isTempValid = await bcrypt.compare(currentPassword, user.password);
    if (!isTempValid) {
      throw new Error("Invalid temporary password");
    }

    // Hash new password
    const hashedNew = await bcrypt.hash(newPassword, 10);

    // Update user: set final password, activate, clear invite fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNew,
        status: "ACTIVE",
        isActive: true,
        inviteToken: null,
        inviteExpiry: null,
        // otp: null,
        // otpExpiry: null,
      },
    });

    return { message: "Password set successfully" };
  }
}