import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  user: User | null = null;
  isEditing = false;
  editForm: User = { firstName: '', lastName: '', email: '', password: '' };
  confirmPassword = '';
  passwordError = '';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.currentUser();
    if (!this.user) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
        this.auth.currentUser.set(this.user);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }

  startEditing() {
    if (this.user) {
      this.editForm = { ...this.user };
      this.confirmPassword = '';
      this.passwordError = '';
      this.isEditing = true;
    }
  }

  saveChanges() {
    // Vérification mot de passe
    if (this.editForm.password && this.editForm.password !== this.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas';
      this.showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    this.passwordError = '';
    this.auth.currentUser.set(this.editForm);
    localStorage.setItem('user', JSON.stringify(this.editForm));
    this.user = { ...this.editForm };
    this.isEditing = false;
    this.confirmPassword = '';
    this.showToast('Profil mis à jour avec succès !', 'success');
  }

  cancelEditing() {
    this.isEditing = false;
    this.confirmPassword = '';
    this.passwordError = '';
    this.showToast('Modification annulée', 'info');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
