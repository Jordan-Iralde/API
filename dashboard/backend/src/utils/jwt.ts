import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signAdminToken() {
    return jwt.sign(
        {
            role: "admin",
        },
        env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
}

export function verifyToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET);
}