// The subset of Google's verified id_token claims this application acts on.
// Deliberately narrow: whatever else the token carries, nothing downstream can
// read a field that isn't listed here.
export type GoogleProfile = {
  /** Google's stable subject id (the `sub` claim). */
  googleId: string;
  email: string;
  /** From the `email_verified` claim. Auto-linking requires this to be true. */
  emailVerified: boolean;
  name: string;
};

// Narrow port over google-auth-library so AuthService never touches the SDK
// and tests can supply a fake, mirroring StorageModule and the injected
// GoogleGenAI client.
export interface GoogleAuthProvider {
  buildAuthUrl(state: string): string;
  exchangeCodeForProfile(code: string): Promise<GoogleProfile>;
}
