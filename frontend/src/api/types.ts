// Matches the backend's response envelope: { success, data }.
// Centralizing this means every service (auth, resume, analysis...) can share
// one generic instead of each hand-rolling the shape. It lives in the API
// layer rather than a feature because the envelope belongs to the transport,
// not to any one domain.
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
