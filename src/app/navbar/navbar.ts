import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../services/theme';
import { MoviesApiService } from '../services/movies-api';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  @Input({ required: true }) title!: string;
  expanded = false;
  searchQuery = '';
  searchResults: Movie[] = [];
  allMovies: Movie[] = [];
  showResults = false;

  auth = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);
  private moviesApi = inject(MoviesApiService);

  toggleMenu(): void {
    this.expanded = !this.expanded;
  }

  closeMenu(): void {
    this.expanded = false;
  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  onSearchFocus(): void {
    if (this.allMovies.length === 0) {
      this.moviesApi.getMovies().subscribe(movies => {
        this.allMovies = movies;
      });
    }
    this.showResults = true;
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.searchResults = this.allMovies.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q)
    );
  }

  goToMovie(movie: Movie): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showResults = false;
    this.router.navigate(['/movie', movie.id]);
  }

  closeSearch(): void {
    setTimeout(() => {
      this.showResults = false;
      this.searchResults = [];
    }, 200);
  }
}
