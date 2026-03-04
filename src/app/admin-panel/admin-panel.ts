import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MoviesApiService } from '../services/movies-api';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-admin-panel',
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminPanel implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  movies = signal<Movie[]>([]);

  nbFilms = computed(() => this.movies().length + 18556);

  avgRate = computed(() => {
    const rates = this.movies().filter(m => m.rate).map(m => m.rate!);
    if (rates.length === 0) return 0;
    return +(rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1);
  });

  satisfaction = computed(() => {
    if (this.movies().length === 0) return 0;
    const good = this.movies().filter(m => (m.rate || 0) >= 3.5).length;
    return Math.round((good / this.movies().length) * 100);
  });

  satisfactionEmoji = computed(() => {
    const s = this.satisfaction();
    if (s >= 80) return '😄';
    if (s >= 60) return '🙂';
    if (s >= 40) return '😐';
    return '😞';
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

  nbAvis = computed(() => 2453);

  nbUtilisateurs = computed(() => '4,286,132');

  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe(movies => this.movies.set(movies));
  }
}
