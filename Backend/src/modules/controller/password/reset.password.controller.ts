import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../../config/db";

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // 🔐 Find the user who passed OTP verification
  const user = await prisma.user.findFirst({
    where: {
      passwordResetAllowed: true,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: "OTP verification required",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id }, // ✅ THIS FIXES "Cannot find name 'user'"
    data: {
      password: hashedPassword,
      passwordResetAllowed: false, // 🔒 lock again
    },
  });

  return res.json({
    message: "Password reset successful",
  });
};
