import {
  authApi,
  type LoginInput,
  type RegisterInput,
} from "@/src/api/auth.api";

export const authService = {
  register: async (data: RegisterInput) => (await authApi.register(data)).data,

  login: async (data: LoginInput) => (await authApi.login(data)).data,

  me: async () => (await authApi.me()).data,

  logout: async () => (await authApi.logout()).data,
};
