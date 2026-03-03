import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  user: User | null = null;
  isEditing = false;
  editForm: User = { firstName: '', lastName: '', email: '', password: '' };
  successMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.currentUser();
    // Si l'utilisateur n'est pas connecté, on redirige vers login
    if (!this.user) {
      // Tentative de récupération depuis localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
        this.auth.currentUser.set(this.user);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  startEditing() {
    if (this.user) {
      this.editForm = { ...this.user };
      this.isEditing = true;
    }
  }

  saveChanges() {
    if (this.editForm) {
      // Mise à jour dans le service et localStorage
      this.auth.currentUser.set(this.editForm);
      localStorage.setItem('user', JSON.stringify(this.editForm));
      this.user = { ...this.editForm };
      this.isEditing = false;
      this.successMessage = 'Profil mis à jour avec succès !';
      setTimeout(() => (this.successMessage = ''), 3000);
    }
  }

  cancelEditing() {
    this.isEditing = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
