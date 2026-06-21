// identity.service.ts

import { IdentityRepository } from "./identity.repository";

export class IdentityService {
    constructor(
        private repository = new IdentityRepository()
    ) { }

    async syncUser(userId: number) {
        const exists =
            await this.repository.exists(userId);

        if (!exists) {
            await this.repository.create(userId);
        }

        return {
            synced: true,
            userId,
        };
    }
}