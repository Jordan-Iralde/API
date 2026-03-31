import { Request } from "express";

export interface AuthRequest extends Request {
  context: {
    userId: number;
    appId: number;
  };
}