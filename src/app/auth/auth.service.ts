// src/app/auth/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

  register(user: User) {
    // Ici tu peux soit stocker dans localStorage pour test
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(email: string, password: string): boolean {
    const stored = localStorage.getItem('user');
    if (!stored) return false;

    const user: User = JSON.parse(stored);
    if (user.email === email && user.password === password) {
      this.currentUser.set(user);
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
  }

  isLoggedIn() {
    return this.currentUser() !== null;
  }
}
