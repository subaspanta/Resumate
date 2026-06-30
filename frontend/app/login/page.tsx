"use client";

import { useState } from "react";
import { authApi } from "@/src/api/auth.api";

export default function LoginPage() {
  const [email, setEmail] = useState("subas@example.com");
  const [password, setPassword] = useState("securepassword123");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await authApi.login({
        email,
        password,
      });

      console.log(response.data);
      alert("Login successful");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2"
        />

        <button
          type="submit"
          className="border p-2"
        >
          Login
        </button>
      </form>
    </main>
  );
}