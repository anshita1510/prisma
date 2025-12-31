// import nodemailer from "nodemailer";

// /**
//  * Email payload interface
//  * Invite / Verification email ke liye
//  */
// interface VerificationEmailPayload {
//   to: string;            // receiver email
//   firstName: string;     // employee first name
//   email: string;         // employee email
//   tempPassword: string; // auto-generated password (plain)
//   token: string;         // verification / set-password token
// }

// /**
//  * Nodemailer transporter config
//  * Gmail SMTP example
//  */
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,          // smtp.gmail.com
//   port: Number(process.env.EMAIL_PORT),  // 587
//   secure: false,                          // true for 465, false for 587
//   auth: {
//     user: process.env.EMAIL_USER,         // your_email@gmail.com
//     pass: process.env.EMAIL_PASS,         // app password
//   },
// });

// /**
//  * Send verification / invite email
//  */
// export const sendVerificationEmail = async (
//   payload: VerificationEmailPayload
// ): Promise<void> => {
//   const { to, firstName, email, tempPassword, token } = payload;

//   // 🔗 Frontend URL (Set password / Verify account page)
//   const verificationUrl = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

//   // ✉️ Email HTML template
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6">
//       <h2>Hello ${firstName},</h2>

//       <p>You have been invited to join our platform.</p>

//       <p><strong>Login Details:</strong></p>
//       <ul>
//         <li>Email: ${email}</li>
//         <li>Temporary Password: ${tempPassword}</li>
//       </ul>

//       <p>Please click the button below to set your password and activate your account:</p>

//       <a href="${verificationUrl}"
//          style="
//            display: inline-block;
//            padding: 10px 20px;
//            background-color: #4f46e5;
//            color: #ffffff;
//            text-decoration: none;
//            border-radius: 5px;
//          ">
//         Set Password
//       </a>

//       <p>This link will expire in 1 hour.</p>

//       <br />
//       <p>Regards,<br/>HR Team</p>
//     </div>
//   `;

//   // 📤 Send email
//   await transporter.sendMail({
//     from: `"HRMS Team" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "You're Invited – Set Your Password",
//     html: htmlContent,
//   });
// };
