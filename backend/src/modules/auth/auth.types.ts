export interface LoginDTO {
    email: string;
    password: string;
    appId: number;
    ip: string;
    userAgent: string | null;
    device: string | null;
}