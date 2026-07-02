import type { HttpClient } from "./http.js";
import type {
  User,
  ChangePasswordResponse,
  RevokeSessionsResponse,
} from "./types.js";

export function createAccount(http: HttpClient) {
  return {
    async getMe(): Promise<User> {
      return http.request<User>("GET", "/api/account/me");
    },

    async updateProfile(name: string): Promise<User> {
      return http.request<User>("PATCH", "/api/account/profile", { name });
    },

    async changePassword(
      currentPassword: string,
      newPassword: string
    ): Promise<ChangePasswordResponse> {
      return http.request<ChangePasswordResponse>(
        "PATCH",
        "/api/account/password",
        { currentPassword, newPassword }
      );
    },

    async revokeSessions(appId: number): Promise<RevokeSessionsResponse> {
      return http.request<RevokeSessionsResponse>(
        "DELETE",
        "/api/account/sessions",
        { appId }
      );
    },
  };
}
