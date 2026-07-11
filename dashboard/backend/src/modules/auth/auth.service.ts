import { env } from "../../config/env";
import { signAdminToken } from "../../utils/jwt";

export class AuthService {
    login(username: string, password: string) {
        const validUser =
            username === env.ADMIN_USERNAME &&
            password === env.ADMIN_PASSWORD;

        if (!validUser) {
            throw new Error("Invalid credentials");
        }

        return signAdminToken();
    }

    me() {
        return {
            role: "admin",
        };
    }
}

export const authService = new AuthService();