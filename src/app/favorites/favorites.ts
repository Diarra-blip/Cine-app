import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MoviesApiService } from '../services/movies-api';
import { AuthService } from '../auth/auth.service';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  private moviesApi = inject(MoviesApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  favorites = signal<Movie[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const user = this.auth.currentUser();
    if (!user) return;

    const favIds: number[] = JSON.parse(
      localStorage.getItem(`favs_${user.email}`) || '[]'
    );

    if (favIds.length === 0) {
      this.loading.set(false);
      return;
    }

    this.moviesApi.getMovies().subscribe(movies => {
      const favMovies = movies.filter(m => favIds.includes(m.id!));
      this.favorites.set(favMovies);
      this.loading.set(false);
    });
  }

  goToMovie(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }

  removeFavorite(movie: Movie) {
    const user = this.auth.currentUser();
    if (!user) return;

    const key = `favs_${user.email}`;
    let favIds: number[] = JSON.parse(localStorage.getItem(key) || '[]');
    favIds = favIds.filter(id => id !== movie.id);
    localStorage.setItem(key, JSON.stringify(favIds));
    this.favorites.update(favs => favs.filter(f => f.id !== movie.id));
  }

  getImageUrl(movie: Movie): string {
    if (movie.image && movie.image.startsWith('http')) return movie.image;
    return `http://localhost:8080/movies/${movie.id}/image`;
  }
}
