import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
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

  movies = signal<Movie[]>([]);
  filteredMovies = signal<Movie[]>([]);
  currentSlide = signal(0);
  searchQuery = '';

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.moviesApi.getMovies().subscribe(movies => {
      this.movies.set(movies);
      this.filteredMovies.set(movies);
    });
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

  goToMovie(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }

  prevSlide(): void {
    this.currentSlide.update(i => i > 0 ? i - 1 : i);
  }

  nextSlide(total: number): void {
    this.currentSlide.update(i => i < total - 1 ? i + 1 : i);
  }

  getImageUrl(movie: Movie): string {
    return `http://localhost:8080/movies/${movie.id}/image`;
  }
}
