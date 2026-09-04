// The subset of Google's verified id_token claims this application uses.
// Narrowly defined to prevent downstream access to unlisted fields.
export type GoogleProfile = {
  googleId: string; // Google's stable subject id (sub claim)
  email: string;
  emailVerified: boolean; // Must be true for auto-linking
  name: string;
};

// Abstraction over google-auth-library for testability.
// AuthService depends on this interface, not the SDK directly.
export interface GoogleAuthProvider {
  buildAuthUrl(state: string): string;
  exchangeCodeForProfile(code: string): Promise<GoogleProfile>;
}
