export interface LoginRequest {
  email: string;
  password: string;
  isPersistent: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  email: string;
}
