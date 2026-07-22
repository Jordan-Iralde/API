import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AppRequest } from "../types/app-request";
import { SessionService } from "../../modules/sessions/session.service";

const sessionService = new SessionService();

export const authMiddleware = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const token = header.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;


    const validSession =
      await sessionService.validateSession(
        decoded.sessionId
      );


    if (!validSession) {
      return res.status(401).json({
        error: "Session expired or revoked",
      });
    }


    req.context = {
      ...req.context,
      userId: decoded.userId,
      appId: decoded.appId,
      role: decoded.role,
      sessionId: decoded.sessionId,
    };


    return next();

  } catch {

    return res.status(401).json({
      error: "Invalid token",
    });

  }
};