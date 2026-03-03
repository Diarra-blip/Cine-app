// src/app/auth/user.model.ts
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  gender?: string;
  acceptTerms?: boolean;
}
