import type { UserService } from "../user.service.ts";
import type { IdentityService } from "../../auth/identity.service.ts";

export class DeleteUserUseCase {
  constructor(
    private userService: UserService,
    private identityService: IdentityService,
  ) {}

  async execute(userId: string): Promise<void> {
    // First revoke all sessions to ensure immediate logout
    await this.identityService.revokeSessions(userId);

    // Then delete the user's identity
    await this.identityService.deleteIdentity(userId);

    // Finally delete the user from our database
    await this.userService.delete(userId);
  }
}
