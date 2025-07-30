export interface User {
  id: string;
  fullName: string;
  email: string;
  lastLoginAt: string | null;
  isBlocked: boolean;
}
