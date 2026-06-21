// identity.repository.ts

import { supabaseAdmin } from "../../lib/supabase";

export class IdentityRepository {
    async exists(userId: number): Promise<boolean> {
        const { data } = await supabaseAdmin
            .from("user_links")
            .select("user_id")
            .eq("user_id", userId)
            .single();

        return !!data;
    }

    async create(userId: number) {
        const { error } = await supabaseAdmin
            .from("user_links")
            .insert({
                user_id: userId,
            });

        if (error) throw error;
    }
}