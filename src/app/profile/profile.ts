import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MoviesApiService } from '../services/movies-api';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private moviesApi = inject(MoviesApiService);

  user: User | null = null;
  isEditing = false;
  editForm: User = { firstName: '', lastName: '', email: '', password: '' };
  confirmPassword = '';
  passwordError = '';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;

  // Stats
  nbFavorites = 0;
  nbReviews = 0;
  nbMovies = 0;
  showPassword = false;
  showConfirm = false;

  ngOnInit() {
    this.user = this.auth.currentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadStats();
  }

  loadStats() {
    const user = this.user!;
    // Favoris
    const favs = JSON.parse(localStorage.getItem(`favs_${user.email}`) || '[]');
    this.nbFavorites = favs.length;

    // Avis
    let totalReviews = 0;
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('reviews_')) {
        const reviews = JSON.parse(localStorage.getItem(k) || '[]');
        totalReviews += reviews.filter((r: any) => r.userEmail === user.email).length;
      }
    });
    this.nbReviews = totalReviews;

    // Films (admin)
    if (this.auth.isAdmin()) {
      this.moviesApi.getMovies().subscribe(movies => {
        this.nbMovies = movies.length;
      });
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
    if (this.editForm.password && this.editForm.password !== this.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas';
      this.showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    this.passwordError = '';
    this.auth.currentUser.set(this.editForm);
    localStorage.setItem(`user_${this.editForm.email}`, JSON.stringify(this.editForm));
    localStorage.setItem('session', JSON.stringify(this.editForm));
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

  // Ajoute ces variables
  avatarPreview: string | null = null;

  // Ajoute cette méthode
  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.editForm.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeAvatar() {
    this.avatarPreview = null;
    this.editForm.avatar = '';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  getRoleBadge(): string {
    return this.auth.isAdmin() ? '⚙️ Administrateur' : '🎬 Cinéphile';
  }

  getRoleColor(): string {
    return this.auth.isAdmin() ? '#e53e3e' : '#f5c518';
  }

}
