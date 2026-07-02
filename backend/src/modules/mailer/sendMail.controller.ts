import { Request, Response } from "express";
import { mailerService } from "./mailer.service";

type SendMailBody = {
  to: string;
  subject: string;
  body: string;
};

interface CustomRequest extends Request {
  context?: {
    userId?: number;
    appId?: number;
  };
}

export const sendMailController = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {

  const { to, subject, body } = req.body;
  const appId = req.context?.appId;
  console.log("MAIL CONTROLLER");


  console.log({ to, subject, body });
  console.log(req.context);

  if (!appId) {
    res.status(400).json({ error: "Missing app context" });
    return;
  }

  const email = await mailerService.create({
    appId,
    to,
    subject,
    body,
  });

  res.json({ success: true, id: email.id });


  console.log({ to, subject, body });
  console.log(req.context);
};