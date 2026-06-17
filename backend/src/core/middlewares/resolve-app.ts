import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { eq, and } from "drizzle-orm";

import { db } from "../db";
import { apiKeys } from "../db/schema";

type CustomRequest = Omit<Request, "context"> & {
  context?: {
    userId?: number;
    appId?: number;
  };
};

export const resolveApp = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.header("X-API-Key");

    if (!apiKey) {
      res.status(401).json({
        error: "Missing API key",
      });

      return;
    }

    const keyHash = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");
    console.log(db.query);

    const [key] = await db
      .select()
      .from(apiKeys)
      .where(
        and(
          eq(apiKeys.keyHash, keyHash),
          eq(apiKeys.active, true)
        )
      )
      .limit(1);
    

    if (!key) {
      res.status(401).json({
        error: "Invalid API key",
      });

      return;
    }

    req.context = {
      ...req.context,
      appId: key.appId,
    };

    next();

  } catch (error) {
    console.error("resolveApp error:", error);

    res.status(500).json({
      error: "Resolve app failed",
    });
  }
};