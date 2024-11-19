export interface IdentityService {
  /**
   * Deletes a user's identity and invalidates all their sessions
   * @param identityId The ID of the identity to delete
   */
  deleteIdentity(identityId: string): Promise<void>;

  /**
   * Revokes all sessions for a given identity
   * @param identityId The ID of the identity whose sessions should be revoked
   */
  revokeSessions(identityId: string): Promise<void>;
}
