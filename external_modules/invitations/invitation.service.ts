import crypto from "node:crypto";

import * as repository from "./invitation.repository";
import {
    InvitationNotFoundError,
    InvitationAlreadyExistsError,
    InvitationExpiredError,
    InvitationNotPendingError
} from "./invitation.errors";
import * as mailService from "./mailer.service";
import * as templateService from "./invitation.template";
import * as organizationRepository from "../organizations/organization.repository";

export async function create(
    resourceId: string,
    resourceType: string,
    email: string,
    role: string,
    invitedBy: number
) {
    const existing =
        await repository.findPending(
            email,
            resourceType,
            resourceId
        );

    if (existing.length > 0) {
        throw new InvitationAlreadyExistsError();
    }

    const token = crypto.randomUUID();

    const invitation =
        await repository.create({
            resourceId,
            resourceType,
            email,
            role,
            invitedBy,
            token,
        });
    await mailService.sendInvitationMail({
        to: email,
        subject: "Invitation to join",
        body: templateService.buildInvitationTemplate({
            inviterName: "",
            resourceName: "",
            resourceType,
            acceptUrl: `http://localhost:4000/invitation/token/${token}`,
        }),
    });
    return invitation;
}

export async function findByToken(
    token: string
) {
    const invitation =
        await repository.findByToken(token);

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    return invitation;
}

export async function accept(
    token: string,
    acceptedBy: number
) {
    const invitation =
        await repository.findByToken(token);

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    if (invitation.status !== "pending") {
        throw new InvitationNotPendingError();
    }

    if (
        new Date(invitation.expires_at) <
        new Date()
    ) {
        await repository.updateStatus(
            invitation.id,
            "expired"
        );

        throw new InvitationExpiredError();
    }

    if (invitation.resource_type === "organization") {
        await organizationRepository.addMember(
            invitation.resource_id,
            acceptedBy,
            invitation.role
        );
    }

    await repository.updateStatus(
        invitation.id,
        "accepted"
    );

    return {
        resourceId: invitation.resource_id,
        resourceType: invitation.resource_type,
        role: invitation.role,
        email: invitation.email,
        acceptedBy,
    };
}

export async function decline(
    token: string
) {
    const invitation =
        await repository.findByToken(token);

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    return repository.updateStatus(
        invitation.id,
        "declined"
    );
}

export async function revoke(
    id: string
) {
    const invitation =
        await repository.findById(id);

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    return repository.revoke(id);
}

export async function expire(
    id: string
) {
    const invitation =
        await repository.findById(id);

    if (!invitation) {
        throw new InvitationExpiredError();
    }

    return repository.updateStatus(
        invitation.id,
        "expired"
    );
}

export async function listByResource(
    resourceType: string,
    resourceId: string
) {
    return repository.findByResource(
        resourceType,
        resourceId
    );
}

export async function listPendingByEmail(
    email: string
) {
    return repository.findPendingByEmail(
        email
    );
}