import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesApiService } from '../services/movies-api';
import { AuthService } from '../auth/auth.service';
import { Movie } from '../models/movie';
import { Review } from '../models/review';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private moviesApi = inject(MoviesApiService);
  private auth = inject(AuthService);

  movie: Movie | null = null;
  reviews: Review[] = [];
  isFavorite = false;
  showReviewForm = false;

  newReview: Review = {
    movieId: 0,
    userEmail: '',
    userName: '',
    comment: '',
    rate: 5,
    date: ''
  };

  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.moviesApi.getMovie(id).subscribe(m => {
      this.movie = m;
      this.newReview.movieId = m.id!;
    });
    this.loadReviews(id);
    this.checkFavorite(id);
  }

  getImageUrl(movie: Movie): string {
    return `http://localhost:8080/movies/${movie.id}/image`;
  }

  // ===== Reviews =====
  loadReviews(movieId: number) {
    const stored = localStorage.getItem(`reviews_${movieId}`);
    this.reviews = stored ? JSON.parse(stored) : [];
  }

  submitReview() {
    const user = this.auth.currentUser();
    if (!user) return;
    this.newReview.userEmail = user.email;
    this.newReview.userName = `${user.firstName} ${user.lastName}`;
    this.newReview.date = new Date().toLocaleDateString('fr-FR');
    this.reviews.unshift({ ...this.newReview });
    localStorage.setItem(`reviews_${this.newReview.movieId}`, JSON.stringify(this.reviews));
    this.newReview.comment = '';
    this.newReview.rate = 5;
    this.showReviewForm = false;
    this.showToast('Avis publié !', 'success');
  }

  deleteReview(index: number) {
    this.reviews.splice(index, 1);
    localStorage.setItem(`reviews_${this.movie?.id}`, JSON.stringify(this.reviews));
    this.showToast('Avis supprimé', 'info');
  }

  averageRate(): number {
    if (!this.reviews.length) return 0;
    return Math.round(this.reviews.reduce((a, r) => a + r.rate, 0) / this.reviews.length * 10) / 10;
  }

  // ===== Favoris =====
  checkFavorite(movieId: number) {
    const user = this.auth.currentUser();
    if (!user) return;
    const favs: number[] = JSON.parse(localStorage.getItem(`favs_${user.email}`) || '[]');
    this.isFavorite = favs.includes(movieId);
  }

  toggleFavorite() {
    const user = this.auth.currentUser();
    if (!user || !this.movie) return;
    const key = `favs_${user.email}`;
    let favs: number[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (this.isFavorite) {
      favs = favs.filter(id => id !== this.movie!.id);
      this.showToast('Retiré des favoris', 'info');
    } else {
      favs.push(this.movie.id!);
      this.showToast('Ajouté aux favoris ❤️', 'success');
    }
    localStorage.setItem(key, JSON.stringify(favs));
    this.isFavorite = !this.isFavorite;
  }

  // ===== Toast =====
  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }

  stars(rate: number): string[] {
    return Array(5).fill('').map((_, i) => i < rate ? '★' : '☆');
  }

  isOwner(review: Review): boolean {
    return this.auth.currentUser()?.email === review.userEmail;
  }
}
