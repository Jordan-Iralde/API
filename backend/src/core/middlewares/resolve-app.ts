import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  context?: {
    userId?: number;
    appId?: number;
  };
}

export const resolveApp = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    res.status(401).json({ error: "No API key" });
    return;
  }

  req.context = {
    userId: 1,
    appId: 1,
  };

  next();
};