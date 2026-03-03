import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';

@Component({
  selector: 'app-movies-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.scss'
})
export class MoviesList implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  movies = signal<Movie[]>([]);

  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe(movies => this.movies.set(movies));
  }

  deleteMovie(id: number | undefined): void {
    if (id) {
      this.moviesApi.deleteMovie(id).subscribe(
        () => this.movies.update(current => current.filter(movie => movie.id !== id))
      );
    }
  }
}