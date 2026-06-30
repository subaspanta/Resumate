import { axiosClient } from "./client";

type LoginInput = {
  email: string;
  password: string;
};

export const authApi = {
  login: (data: LoginInput) => axiosClient.post("/auth/login", data),

  me: () => axiosClient.get("/auth/me"),
};
