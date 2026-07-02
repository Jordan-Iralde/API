import type { HttpClient } from "./http.js";
import type { LoginResponse, RegisterResponse } from "./types.js";

export function createAuth(http: HttpClient) {
  return {
    async login(email: string, password: string): Promise<LoginResponse> {
      const data = await http.request<LoginResponse>(
        "POST",
        "/api/auth/login",
        { email, password }
      );

      http.setToken(data.token);
      return data;
    },

    async register(
      name: string,
      email: string,
      password: string
    ): Promise<RegisterResponse> {
      return http.request<RegisterResponse>("POST", "/api/auth/register", {
        name,
        email,
        password,
      });
    },

    logout(): void {
      http.clearToken();
    },
  };
}
