export interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Matches your backend's response envelope: { success, data }.
// Centralizing this means every service (auth, resume, parsing...)
// can share one generic instead of each hand-rolling the shape.
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
