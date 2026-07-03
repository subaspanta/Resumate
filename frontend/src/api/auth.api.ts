import { axiosClient } from "./client";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
};

export const authApi = {
  register: (data: RegisterInput) => axiosClient.post("/auth/register", data),

  login: (data: LoginInput) => axiosClient.post("/auth/login", data),

  me: () => axiosClient.get("/auth/me"),

  logout: () => axiosClient.post("/auth/logout"),
};
