import { db } from "../../core/db"; // ajustá path
import { emails } from "../../core/db/schema"; // ajustá path
import { eq } from "drizzle-orm";

import { sendEmail } from "./smtp.provider";

type CreateEmailInput = {
  appId: number;
  to: string;
  subject: string;
  body: string;
};

export const mailerService = {
  async create(data: CreateEmailInput) {
    if (!data.to || !data.subject || !data.body) {
      throw new Error("Invalid email payload");
    }

    // 1. guardar
    const [email] = await db
      .insert(emails)
      .values({
        appId: data.appId,
        to: data.to,
        subject: data.subject,
        body: data.body,
        status: "pending",
      })
      .returning();

    // 2. enviar
    try {
      await sendEmail(data);

      await db
        .update(emails)
        .set({ status: "sent" })
        .where(eq(emails.id, email.id));

    } catch (err: any) {
      await db
        .update(emails)
        .set({
          status: "failed",
          error: err?.message || "unknown_error",
        })
        .where(eq(emails.id, email.id));
    }

    return email;
  },
};