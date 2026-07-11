import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("API KEY:", process.env.RESEND_API_KEY);

type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};
export const sendEmail = async ({
  to,
  subject,
  body,
}: SendEmailInput) => {
  try {
    const response = await resend.emails.send({
      from: "Code't Lab <noreply@codetlab.com>",
      to,
      subject,
      html: body,
    });

    console.log("EMAIL SENT:", response);

    return response;

  } catch (error: any) {
    console.error("RESEND ERROR:", error);

    throw new Error(
      error?.message || "Failed to send email"
    );
  }
};