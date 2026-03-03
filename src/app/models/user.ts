import { Review } from './review';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  gender?: string;
  acceptTerms?: boolean;
  favorites?: number[];
  reviews?: Review[];
  role?: 'admin' | 'client';
}
