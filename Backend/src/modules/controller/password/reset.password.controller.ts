
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../config/db";
import { sendEmail } from "../../../shared/utils/sendEmail";
/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  let decoded: { userId: string };

  try {
    decoded = jwt.verify(
      resetToken,
      process.env.RESET_SECRET!
    ) as { userId: string };
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const userId = Number(decoded.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid token" });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
  res.json({ message: "Password reset successful" });
};
