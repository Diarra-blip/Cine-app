import { Component, inject, OnInit } from '@angular/core';
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
export class AddMovie implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);

  // Initialisation des limites de dates
  today: string = new Date().toISOString().split('T')[0];
  minDate: string = '1895-12-28';
  maxLimitDate: string = '';

  movie: Movie = {
    title: '',
    director: '',
    releaseDate: '',
    synopsis: '',
    id: undefined,
    rate: 0,
    image: '',
    category: ''
  };

  ngOnInit(): void {
    // Calcul de la limite à +5 ans pour les films à venir
    const future = new Date();
    future.setFullYear(future.getFullYear() + 5);
    this.maxLimitDate = future.toISOString().split('T')[0];
  }

  addMovie(): void {
    // Validation de la date
    const selectedDate = new Date(this.movie.releaseDate as string);
    const limitDate = new Date(this.maxLimitDate);
    const originDate = new Date(this.minDate);

    if (!this.movie.releaseDate || isNaN(selectedDate.getTime())) {
      this.toaster.show('⚠️ Veuillez choisir une date valide.');
      return;
    }

    if (selectedDate > limitDate) {
      this.toaster.show('⚠️ La date est trop lointaine (max 5 ans).');
      return;
    }

    if (selectedDate < originDate) {
      this.toaster.show('⚠️ Le cinéma n\'existait pas encore en ' + selectedDate.getFullYear());
      return;
    }

    // Vérification des champs obligatoires et enregistrement
    if (this.movie.title.trim() && this.movie.director.trim()) {
      const movieToSave: Movie = {
        ...this.movie,
        title: this.movie.title.trim(),
        director: this.movie.director.trim(),
        synopsis: this.movie.synopsis.trim()
      };

      this.moviesApi.addMovie(movieToSave).subscribe({
        next: () => {
          this.toaster.show('🎬 Film enregistré avec succès !');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toaster.show('❌ Erreur technique lors de l\'ajout');
          console.error(err);
        }
      });
    } else {
      this.toaster.show('⚠️ Veuillez remplir tous les champs obligatoires.');
    }
  }
}
