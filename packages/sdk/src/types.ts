// ─── SDK Config ──────────────────────────────────────────

export interface SDKConfig {
  baseUrl: string;
  apiKey: string;
}

// ─── Auth ────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
}

// ─── Account ─────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface ChangePasswordResponse {
  success: boolean;
}

export interface RevokeSessionsResponse {
  success: boolean;
}

// ─── Sync ────────────────────────────────────────────────

export interface SyncProfile {
  id: number;
  tenant_user_id: number;
  name: string;
  email: string;
}

export interface SyncResponse {
  success: boolean;
  profile: SyncProfile;
}
