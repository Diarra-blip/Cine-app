import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
import { ViewTrackingService } from '../services/view-tracking';
import { MovieCard } from './movie-card/movie-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe, MovieCard, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  private readonly router = inject(Router);
  private readonly viewTracking = inject(ViewTrackingService);

  movies = signal<Movie[]>([]);
  filteredMovies = signal<Movie[]>([]);
  mostViewed = signal<any[]>([]);
  topRated = signal<any[]>([]);
  currentSlide = signal(0);
  searchQuery = '';

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.moviesApi.getMovies().subscribe(movies => {
      this.movies.set(movies);
      this.filteredMovies.set(movies);
      this.mostViewed.set(this.viewTracking.getMostViewed(movies));
      this.topRated.set(this.viewTracking.getTopRated(movies));
    });
  }

  goToMovie(movie: Movie) {
    this.viewTracking.incrementView(movie.id!); // ← track le clic
    this.router.navigate(['/movie', movie.id]);
  }

  onSearch() {
    const q = this.searchQuery.toLowerCase();
    if (!q) {
      this.filteredMovies.set(this.movies());
      return;
    }
    this.filteredMovies.set(
      this.movies().filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
      )
    );
  }

  prevSlide(): void {
    this.currentSlide.update(i => i > 0 ? i - 1 : i);
  }

  nextSlide(total: number): void {
    this.currentSlide.update(i => i < total - 1 ? i + 1 : i);
  }

  getImageUrl(movie: any): string {
    return `http://localhost:8080/movies/${movie.id}/image`;
  }
}
