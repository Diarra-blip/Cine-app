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
  displayedMovies = signal<Movie[]>([]);
  mostViewed = signal<any[]>([]);
  topRated = signal<any[]>([]);
  currentSlide = signal(0);
  searchQuery = '';
  pageSize = 8;
  currentPage = 1;
  hasMore = signal(false);

  ngOnInit() {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadMovies();
  }

  loadMovies() {
    this.moviesApi.getMovies().subscribe(movies => {
      this.movies.set(movies);
      this.filteredMovies.set(movies);
      this.mostViewed.set(this.viewTracking.getMostViewed(movies));
      this.topRated.set(this.viewTracking.getTopRated(movies));
      this.currentPage = 1;
      this.updateDisplayed(movies);
    });
  }

  updateDisplayed(movies: Movie[]) {
    const end = this.currentPage * this.pageSize;
    this.displayedMovies.set(movies.slice(0, end));
    this.hasMore.set(end < movies.length);
  }

  loadMore() {
    this.currentPage++;
    this.updateDisplayed(this.filteredMovies());
  }

  showLess() {
    this.currentPage = 1;
    this.updateDisplayed(this.filteredMovies());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearch() {
    const q = this.searchQuery.toLowerCase();
    const filtered = !q ? this.movies() : this.movies().filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q)
    );
    this.filteredMovies.set(filtered);
    this.currentPage = 1;
    this.updateDisplayed(filtered);
  }

  goToMovie(movie: Movie) {
    this.viewTracking.incrementView(movie.id!);
    this.router.navigate(['/movie', movie.id]);
  }

  prevSlide(): void {
    this.currentSlide.update(i => i > 0 ? i - 1 : i);
  }

  nextSlide(total: number): void {
    this.currentSlide.update(i => i < total - 1 ? i + 1 : i);
  }

  getImageUrl(movie: any): string {
    if (movie.image && movie.image.startsWith('http')) return movie.image;
    return `http://localhost:8080/movies/${movie.id}/image`;
  }
}
