import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
import { MovieCard } from './movie-card/movie-card';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, MovieCard, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  movies = signal<Movie[]>([]);
  currentSlide = signal(0);

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.moviesApi.getMovies().subscribe(movies => {
      this.movies.set(movies);
    });
  }

  prevSlide(): void {
    this.currentSlide.update(i => i > 0 ? i - 1 : i);
  }

  nextSlide(total: number): void {
    this.currentSlide.update(i => i < total - 1 ? i + 1 : i);
  }
}
