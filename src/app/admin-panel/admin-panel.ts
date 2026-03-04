import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MoviesApiService } from '../services/movies-api';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-admin-panel',
  imports: [RouterLink],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminPanel implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  movies = signal<Movie[]>([]);

  nbFilms = computed(() => this.movies().length);
  avgRate = computed(() => {
    const rates = this.movies().filter(m => m.rate).map(m => m.rate!);
    if (rates.length === 0) return 0;
    return (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1);
  });
  bestMovie = computed(() => {
    const sorted = [...this.movies()].sort((a, b) => (b.rate || 0) - (a.rate || 0));
    return sorted.length > 0 ? sorted[0].title : 'Aucun';
  });
  latestMovie = computed(() => {
    const sorted = [...this.movies()].sort((a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
    return sorted.length > 0 ? sorted[0].title : 'Aucun';
  });

  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe(movies => this.movies.set(movies));
  }
}