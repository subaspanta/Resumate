"use client";

import { authService } from "@/src/features/auth";

export default function HomePage() {
  const handleClick = async () => {
    try {
      const response = await authService.me();
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