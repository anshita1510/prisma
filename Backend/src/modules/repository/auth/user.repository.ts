import { prisma } from "../../../config/db";

export class UserRepository {

  findByInviteToken(token: string) {
    return prisma.user.findFirst({
      where: { inviteToken: token },
    });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  countSuperAdmins() {
    return prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });
  }

  create(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    role: any;
    status: any;
    password?: string;
    inviteToken?: string;
    inviteExpiry?: Date;
    isActive?: boolean; // ✅ ADD THIS
  }) {
    return prisma.user.create({ data });
  }



  update(id: number, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

}
