// import bcrypt from "bcrypt";
// import { SendEmailUseCase } from "../../usecase/email/sendEmail.usecase";
// import { NodemailerService } from "../../repository/email/nodemailer.service";
// import { prisma } from "../../../config/db";

// const emailService = new NodemailerService();
// const sendEmailUseCase = new SendEmailUseCase(emailService);

// export class CreateSuperAdminUsecase {
//   async execute(data: {
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//   }) {
//     // 1️⃣ Check if SUPER_ADMIN already exists
//     const existing = await prisma.user.findFirst({
//       where: { role: "SUPER_ADMIN" },
//     });

//     if (existing) {
//       throw new Error("Super Admin already exists");
//     }

//     // 2️⃣ Hash password
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // 3️⃣ Create SUPER_ADMIN with hashed password
//     const user = await prisma.user.create({
//       data: {
//         email: data.email,
//         password: hashedPassword, // ✅ HASHED
//         firstName: data.firstName,
//         lastName: data.lastName,
//         role: "SUPER_ADMIN",
//         status: "ACTIVE",
//       },
//     });

//     // 4️⃣ Send welcome email (non-blocking)
//     try {
//       await sendEmailUseCase.execute({
//         to: user.email,
//         subject: "Welcome Super Admin",
//         html: `
//           <h1>Welcome ${user.firstName}</h1>
//           <p>Your Super Admin account has been created.</p>
//         `,
//       });
//     } catch (err) {
//       console.error("Error sending email:", err);
//     }

//     return user;
//   }
// }



import bcrypt from "bcrypt";
import crypto from "crypto";
import { SendEmailUseCase } from "../../usecase/email/sendEmail.usecase";
import { NodemailerService } from "../../repository/email/nodemailer.service";
import { prisma } from "../../../config/db";

const emailService = new NodemailerService();
const sendEmailUseCase = new SendEmailUseCase(emailService);

export class CreateSuperAdminUsecase {
  async execute(data: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const existing = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    if (existing) {
      throw new Error("Super Admin already exists");
    }

    // 🔐 Generate password
    const rawPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
      },
    });

    // 📩 Email credentials
    await sendEmailUseCase.execute({
      to: user.email,
      subject: "Your Super Admin Credentials",
      html: `
        <h2>Welcome ${user.firstName}</h2>
        <p>Your Super Admin account is ready.</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Password:</b> ${rawPassword}</p>
        <p>Please change your password after first login.</p>
      `,
    });

    return user;
  }
}

