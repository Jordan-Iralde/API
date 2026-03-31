// /modules/contact/contact.controller.ts

import { Request, Response } from "express";
import { mailerService } from "../mailer/mailer.service";

export const contactController = async (req: Request, res: Response): Promise<void> => {
  const { name, email, message } = req.body;
  console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL);
    console.log("BODY:", req.body);
  if (!name || !email || !message) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const html = `
    <h2>Nuevo mensaje</h2>
    <p><b>Nombre:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p>${message}</p>
  `;
console.log({
  to: process.env.CONTACT_EMAIL,
  subject: "Nuevo contacto",
  body: html,
});
  await mailerService.create({
    appId: 1,
    to: process.env.CONTACT_EMAIL!,
    subject: "Nuevo contacto",
    body: html,
  });

  res.json({ success: true });
};