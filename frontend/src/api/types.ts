// Matches the backend's response envelope: { success, data }.
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
