// src/modules/account/account.controller.ts

import { Response } from "express";
import { AppRequest } from "../../core/types/app-request";
import * as service from "./account.service";
import { SessionService } from "../sessions/session.service";
const sessionService = new SessionService();

export const getMeController = async (req: AppRequest, res: Response) => {
  try {
    const userId = req.context?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await service.getMe(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req: AppRequest, res: Response) => {
  try {
    const userId = req.context?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updated = await service.updateProfile(userId, name);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const changePasswordController = async (req: AppRequest, res: Response) => {
  try {
    const userId = req.context?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await service.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
export const getSessions = async (
  req: AppRequest,
  res: Response
) => {

  try {

    const userId = req.context?.userId;


    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }


    const sessions =
      await service.getSessions(userId);


    return res.json(sessions);


  } catch (err: any) {

    return res.status(500).json({
      error: err.message,
    });

  }
};



export const revokeSession = async (
  req: AppRequest,
  res: Response
) => {

  try {

    const userId = req.context?.userId;
    const { sessionId } = req.params;


    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }


    if (typeof sessionId !== "string") {
      return res.status(400).json({
        error: "Invalid session id",
      });
    }


    await service.revokeSession(
      userId,
      sessionId
    );


    return res.sendStatus(204);


  } catch (err: any) {

    if (err.message === "Forbidden") {
      return res.status(403).json({
        error: err.message,
      });
    }


    if (
      err.message === "Session not found" ||
      err.message === "Session already revoked"
    ) {
      return res.status(400).json({
        error: err.message,
      });
    }


    return res.status(500).json({
      error: err.message,
    });

  }
};



export const revokeAllSessions = async (
  req: AppRequest,
  res: Response
) => {

  try {

    const userId = req.context?.userId;


    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }


    const result =
      await service.revokeAllSessions(userId);


    return res.json(result);


  } catch (err: any) {

    return res.status(500).json({
      error: err.message,
    });

  }
};