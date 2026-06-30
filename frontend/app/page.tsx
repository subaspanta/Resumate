"use client";

import { authApi } from "@/src/api/auth.api";

export default function HomePage() {
  const handleClick = async () => {
    try {
      const response = await authApi.me();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleClick}>
      Test Me Endpoint
    </button>
  );
}