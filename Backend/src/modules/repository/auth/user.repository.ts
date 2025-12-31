import { prisma } from "../../../config/db";

export class UserRepository {

  async countUsers(): Promise<number> {
    return prisma.user.count();
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async updatePassword(userId: number, hashedPassword: string) {

    console.log("Updating password for user: ", userId);

    return prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select:{
        id: true,
        email: true
      }
    });
  }

  async create(data: any) {
    console.log("Creating user with data: ", data);
    return prisma.user.create({
      data: {
        email: data.email,
        role: data.role,
        // firstName: data.firstName,
        // lastName: data.lastName,
        status: data.status,
        password: data.password,
        verificationToken: data.verificationToken,
        tokenExpiry: data.tokenExpiry
      }
    });
  }

  async update(id: number, data: any) {
    return prisma.user.update({ where: { id }, data });
  }

  async findVerificationToken(token: string) {
    return prisma.user.findFirst({
      where: {
        verificationToken: token,
        tokenExpiry: {
          gt: new Date()
        },
      },
    });
  }
}