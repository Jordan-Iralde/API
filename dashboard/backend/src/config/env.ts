import "dotenv/config";
import { z } from "zod";

const schema = z.object({
    PORT: z.string().default("3000"),
    JWT_SECRET: z.string().min(32),

    ADMIN_USERNAME: z.string(),
    ADMIN_PASSWORD: z.string(),

    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
});

export const env = schema.parse(process.env);