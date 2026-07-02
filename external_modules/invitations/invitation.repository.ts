import { supabase } from "../../db/supabase";

export async function create(input: {
    resourceId: string;
    resourceType: string;
    email: string;
    role: string;
    invitedBy: number;
    token: string;
}) {
    const { data, error } = await supabase
        .from("invitations")
        .insert({
            resource_id: input.resourceId,
            resource_type: input.resourceType,
            email: input.email,
            role: input.role,
            invited_by: input.invitedBy,
            token: input.token,
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function findById(id: string) {
    const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
}

export async function findByToken(token: string) {
    const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("token", token)
        .single();

    if (error) throw error;

    return data;
}

export async function findPending(
    email: string,
    resourceType: string,
    resourceId: string
) {
    const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("email", email)
        .eq("resource_type", resourceType)
        .eq("resource_id", resourceId)
        .eq("status", "pending");

    if (error) throw error;

    return data;
}

export async function findByResource(
    resourceType: string,
    resourceId: string
) {
    const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("resource_type", resourceType)
        .eq("resource_id", resourceId)
        .order("created_at", {
            ascending: false,
        });

    if (error) throw error;

    return data;
}

export async function findPendingByEmail(
    email: string
) {
    const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("email", email)
        .eq("status", "pending")
        .order("created_at", {
            ascending: false,
        });

    if (error) throw error;

    return data;
}

export async function updateStatus(
    id: string,
    status:
        | "pending"
        | "accepted"
        | "declined"
        | "revoked"
        | "expired"
) {
    const { data, error } = await supabase
        .from("invitations")
        .update({
            status,
            updated_at: new Date().toISOString(),
            accepted_at:
                status === "accepted"
                    ? new Date().toISOString()
                    : null,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function revoke(id: string) {
    return updateStatus(id, "revoked");
}