import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { AppRequest } from "../../core/types/app-request";
import { UAParser } from "ua-parser-js";

export const register = async (
  req: AppRequest,
  res: Response
) => {
  try {


    const { name, email, password } = req.body;

    const user = await registerUser(
      name,
      email,
      password,
      req.context?.appId!
    );

    res.json(user);

  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};

export const login = async (req: AppRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const browser = result.browser.name ?? "Unknown Browser";
    const os = result.os.name ?? "Unknown OS";

    const device = `${browser} · ${os}`;

    const data = await loginUser({
      email,
      password,
      appId: req.context!.appId!,
      ip: req.ip!,
      userAgent: req.headers["user-agent"] ?? null,
      device,
    });

    res.json(data);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};