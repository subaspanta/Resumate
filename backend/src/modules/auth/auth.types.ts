export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

// SafeUser plus the one field AuthService.resolveAfterRace's invariant check
// reads. Deliberately separate from SafeUser: googleId is an internal identity
// detail, not something the /auth/me response should start returning.
export type GoogleLinkedUser = SafeUser & { googleId: string | null };

export type AuthResponse = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

export type RefreshResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};
