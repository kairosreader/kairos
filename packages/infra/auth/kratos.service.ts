import type { IdentityService } from "@kairos/core";

export class KratosIdentityService implements IdentityService {
  private authUrl: string;

  constructor() {
    this.authUrl = Deno.env.get("AUTH_ADMIN_URL")!;
  }

  async deleteIdentity(identityId: string): Promise<void> {
    const response = await fetch(
      `${this.authUrl}/admin/identities/${identityId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete Kratos identity: ${errorText}`);
    }
  }

  async revokeSessions(identityId: string): Promise<void> {
    const response = await fetch(
      `${this.authUrl}/admin/identities/${identityId}/sessions`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to revoke sessions: ${errorText}`);
    }
  }
}
