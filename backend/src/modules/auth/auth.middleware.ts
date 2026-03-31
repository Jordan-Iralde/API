import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../../core/config/env";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      userId: number;
      appId: number;
    };

    // 👇 casteo interno (clave)
    (req as any).context = {
      userId: decoded.userId,
      appId: decoded.appId,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};