
import crypto from "crypto";
import bcrypt from "bcrypt";
import { UserRepository } from "../../repository/auth/user.repository";
import { SendEmailUseCase } from "../email/sendEmail.usecase";
import { Role, Status, Designation, DepartmentType } from "@prisma/client";
import { prisma } from "../../../config/db";

export class InviteEmployeeUsecase {
  constructor(
    private userRepo: UserRepository,
    private sendEmailUseCase: SendEmailUseCase
  ) { }

  async execute(
    inviterRole: Role,
    data: {
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      designation: string;
      role: Role;
      companyId?: number;
      departmentId?: number;
    }
  ) {
    const allowedRoles: Role[] = [Role.SUPER_ADMIN, Role.ADMIN];

    if (!allowedRoles.includes(inviterRole)) {
      throw new Error("Unauthorized");
    }

    /* 🚫 Prevent SUPER_ADMIN creation */
    if (data.role === Role.SUPER_ADMIN) {
      throw new Error("Cannot invite Super Admin");
    }

    /* 👤 Check existing user */
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    /* ⏳ Tokens & Expiry */
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);
    const otpExpiry = new Date(Date.now() + 30 * 60 * 1000);

    /* 🧑 CREATE USER (FULLY FILLED ✅) */
    const user = await this.userRepo.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      designation: data.designation,
      role: data.role,
      status: Status.ACTIVE,  // Changed from PENDING to ACTIVE
      isActive: true,         // Changed from false to true
      tempPassword: hashedTempPassword,
      otp: hashedOtp,
      otpExpiry: otpExpiry,
      inviteToken,
      inviteExpiry,
    });

    /* 🔐 Password setup record */
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tempPassword: hashedTempPassword,  // already set in create, but safe
        otp: hashedOtp,
        otpExpiry: otpExpiry,
      },
    });

    /* 🏢 CREATE EMPLOYEE RECORD */
    await this.createEmployeeRecord(user.id, data);

    /* 📧 Send invite email */
    await this.sendEmailUseCase.execute({
      to: data.email,
      subject: "You're Invited to Join the Platform",
      html: `
        <h2>Welcome ${data.firstName}!</h2>
        <p>You have been invited to join our platform.</p>

        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p><strong>OTP:</strong> ${rawOtp}</p>

        <p>This OTP is valid for 30 minutes.</p>

        <br />
        <p>Thanks,<br/>Team Tikr</p>
      `,
    });

    return {
      message: "Invitation sent successfully",
      email: data.email,
    };
  }

  private async createEmployeeRecord(userId: number, data: any) {
    try {
      // Get or create default company
      let companyId = data.companyId;
      if (!companyId) {
        const defaultCompany = await prisma.company.upsert({
          where: { code: 'DEFAULT_COMPANY' },
          update: {},
          create: {
            name: 'Default Company',
            code: 'DEFAULT_COMPANY',
            isActive: true
          }
        });
        companyId = defaultCompany.id;

        // Update user with company
        await prisma.user.update({
          where: { id: userId },
          data: { companyId }
        });
      }

      // Get or create default department
      let departmentId = data.departmentId;
      if (!departmentId) {
        const defaultDepartment = await prisma.department.upsert({
          where: {
            companyId_name: {
              companyId: companyId,
              name: 'General'
            }
          },
          update: {},
          create: {
            name: 'General',
            type: DepartmentType.OPERATIONS,
            companyId: companyId
          }
        });
        departmentId = defaultDepartment.id;
      }

      // Map user role to employee designation
      let designation: Designation;
      switch (data.role) {
        case 'SUPER_ADMIN':
        case 'ADMIN':
          designation = Designation.MANAGER;
          break;
        case 'MANAGER':
          designation = Designation.MANAGER;
          break;
        default:
          designation = Designation.SOFTWARE_ENGINEER;
      }

      // Generate unique employee code
      const employeeCode = `EMP${userId.toString().padStart(4, '0')}`;

      // Create employee record
      const employee = await prisma.employee.create({
        data: {
          userId,
          companyId,
          departmentId,
          name: `${data.firstName} ${data.lastName}`.trim(),
          designation,
          employeeCode,
          isActive: true
        }
      });

      console.log(`✅ Created employee record for user ${userId} (Employee ID: ${employee.id}, Code: ${employeeCode})`);
      return employee;
    } catch (error) {
      console.error(`❌ Failed to create employee record for user ${userId}:`, error);
      // Don't throw error to avoid breaking user creation
    }
  }
}

