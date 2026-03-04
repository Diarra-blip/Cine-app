import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

 constructor() {
   // Migration des anciens comptes stockés sous 'user'
   const oldUser = localStorage.getItem('user');
   if (oldUser) {
     const user: User = JSON.parse(oldUser);
     if (user.email) {
       localStorage.setItem(`user_${user.email}`, JSON.stringify(user));
       localStorage.removeItem('user');
     }
   }

   // Crée le compte admin par défaut s'il n'existe pas
   const admin: User = {
     firstName: 'Admin',
     lastName: 'Takima',
     email: 'admin@takima.fr',
     password: 'admin123',
     role: 'admin'
   };
   if (!localStorage.getItem(`user_${admin.email}`)) {
     localStorage.setItem(`user_${admin.email}`, JSON.stringify(admin));
   }

   // Restaure la session si l'utilisateur était connecté
   const session = localStorage.getItem('session');
   if (session) {
     this.currentUser.set(JSON.parse(session));
   }
 }

  register(user: User): boolean {
    const key = `user_${user.email}`;
    if (localStorage.getItem(key)) return false; // email déjà utilisé
    user.role = 'client';
    localStorage.setItem(key, JSON.stringify(user));
    return true;
  }

  login(email: string, password: string): boolean {
    const stored = localStorage.getItem(`user_${email}`);
    if (!stored) return false;
    const user: User = JSON.parse(stored);
    if (user.password === password) {
      this.currentUser.set(user);
      localStorage.setItem('session', JSON.stringify(user)); // garde la session
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('session');
  }

  isLoggedIn() {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isClient(): boolean {
    return this.currentUser()?.role === 'client';
  }
}
