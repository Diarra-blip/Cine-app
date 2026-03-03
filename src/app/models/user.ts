export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  gender?: string;
  acceptTerms?: boolean;
  favorites?: number[]; // IDs des films favoris
  reviews?: Review[];   // Avis laissés
  role?: 'admin' | 'client'; // Rôle
}
