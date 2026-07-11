import { apps } from "../core/db/schema";
import { db } from "../core/db/index";
import { eq } from "drizzle-orm";

export enum AppRoute {
    VERIFY_EMAIL = "/auth/verify-email",
    RESET_PASSWORD = "/auth/reset-password",
    LOGIN = "/auth/login",
    INVITATION = "/invitations/accept",
}
export const getAppById = async (appId: number) => {
    const [app] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, appId))
        .limit(1);

    if (!app) {
        throw new Error("APP_NOT_FOUND");
    }

    return app;
};

export const buildAppUrl = (
    app: { frontendUrl: string },
    route: AppRoute,
    params?: Record<string, string>
) => {
    const url = new URL(route, app.frontendUrl);

    if (params) {
        Object.entries(params).forEach(([k, v]) =>
            url.searchParams.set(k, v)
        );
    }

    return url.toString();
};