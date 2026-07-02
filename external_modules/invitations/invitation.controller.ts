import { Request, Response } from "express";

import * as service from "./invitation.service";

type TokenParams = {
    token: string;
};

type IdParams = {
    id: string;
};

export async function create(
    req: Request,
    res: Response
) {
    const invitation =
        await service.create(
            req.body.resourceId,
            req.body.resourceType,
            req.body.email,
            req.body.role,
            req.context!.profileId!
        );

    res.status(201).json(invitation);
}

export async function findByToken(
    req: Request<TokenParams>,
    res: Response
) {
    const invitation =
        await service.findByToken(
            req.params.token
        );

    res.json(invitation);
}

export async function accept(
    req: Request<TokenParams>,
    res: Response
) {
    const invitation =
        await service.accept(
            req.params.token,
            req.context!.profileId!
        );

    res.json(invitation);
}

export async function decline(
    req: Request<TokenParams>,
    res: Response
) {
    const invitation =
        await service.decline(
            req.params.token
        );

    res.json(invitation);
}

export async function revoke(
    req: Request<IdParams>,
    res: Response
) {
    const invitation =
        await service.revoke(
            req.params.id
        );

    res.json(invitation);
}

export async function expire(
    req: Request<IdParams>,
    res: Response
) {
    const invitation =
        await service.expire(
            req.params.id
        );

    res.json(invitation);
}

export async function listByResource(
    req: Request,
    res: Response
) {
    const invitations =
        await service.listByResource(
            req.query.resourceType as string,
            req.query.resourceId as string
        );

    res.json(invitations);
}

export async function myPending(
    req: Request,
    res: Response
) {
    const invitations =
        await service.listPendingByEmail(
            req.context!.email!
        );

    res.json(invitations);
}