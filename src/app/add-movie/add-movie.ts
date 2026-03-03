import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- 1. Ajoute cet import
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
import { ToasterService } from '../services/toaster';

@Component({
  selector: 'app-add-movie',
  standalone: true, // Assure-toi que standalone est bien présent si tu es en Angular 17+
  imports: [FormsModule, CommonModule], // <-- 2. Ajoute CommonModule ici
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.scss'
})
export class AddMovie {
  private readonly moviesApi = inject(MoviesApiService);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);

  movie: Movie = {
    title: '',
    director: '',
    releaseDate: new Date(),
    synopsis: '',
    id: undefined,
    rate: undefined,
    image: undefined
  };

  addMovie(): void {
    this.moviesApi.addMovie(this.movie).subscribe(() => {
      this.toaster.show('Nouveau film ajouté !');
      this.router.navigate(['/movies']);
    });
  }
}