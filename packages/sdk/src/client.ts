import type { SDKConfig } from "./types.js";
import { HttpClient } from "./http.js";
import { createAuth } from "./auth.js";
import { createAccount } from "./account.js";
import { createSync } from "./sync.js";

export function createClient(config: SDKConfig) {
  const http = new HttpClient(config.baseUrl, config.apiKey);

  return {
    auth: createAuth(http),
    account: createAccount(http),
    sync: createSync(http),
    http,
  };
}
