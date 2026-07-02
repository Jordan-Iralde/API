import type { HttpClient } from "./http.js";
import type { SyncResponse } from "./types.js";

export function createSync(http: HttpClient) {
  return {
    async syncUser(): Promise<SyncResponse> {
      return http.request<SyncResponse>("POST", "/api/sync/sync");
    },
  };
}
