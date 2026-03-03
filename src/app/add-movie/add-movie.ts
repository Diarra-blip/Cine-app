import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
import { ToasterService } from '../services/toaster';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.scss'
})
export class AddMovie {
  private readonly moviesApi = inject(MoviesApiService);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);

  // Définit la date du jour pour le blocage HTML
  today: string = new Date().toISOString().split('T')[0];

  movie: Movie = {
    title: '',
    director: '',
    releaseDate: '', 
    synopsis: '',
    id: undefined,
    rate: 0,
    image: ''
  };

  addMovie(): void {
    if (this.movie.title && this.movie.director) {
      // Nettoyage pro : on enlève les espaces inutiles
      const movieToSave: Movie = {
        ...this.movie,
        title: this.movie.title.trim(),
        director: this.movie.director.trim(),
        synopsis: this.movie.synopsis.trim()
      };

      this.moviesApi.addMovie(movieToSave).subscribe({
        next: () => {
          this.toaster.show('🎬 Film enregistré avec succès !');
          this.router.navigate(['/movies']);
        },
        error: (err) => {
          this.toaster.show('❌ Erreur lors de l\'enregistrement');
          console.error(err);
        }
      });
    }
  }
}