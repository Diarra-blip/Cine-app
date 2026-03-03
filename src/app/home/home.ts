import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
import { MovieCard } from './movie-card/movie-card';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, MovieCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private readonly moviesApi = inject(MoviesApiService);
  movies$: Observable<Movie[]> = this.moviesApi.getMovies();
}