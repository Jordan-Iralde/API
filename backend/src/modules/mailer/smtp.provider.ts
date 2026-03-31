import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};

export const sendEmail = async ({ to, subject, body }: SendEmailInput) => {
  await transporter.sendMail({
    from: `"Mailer" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html: body,
  });
};