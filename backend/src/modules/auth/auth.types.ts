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

export type AuthResponse = {
  user: SafeUser;
  accessToken: string;
};
