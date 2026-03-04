import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
import { ToasterService } from '../services/toaster';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './edit-movie.html',
  styleUrl: './edit-movie.scss'
})
export class EditMovie implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toaster = inject(ToasterService);

  // Variables pour la validation de date
  minDate: string = '1895-12-28';
  maxLimitDate: string = '';

  movie: Movie = {
    title: '',
    director: '',
    releaseDate: '',
    synopsis: '',
    id: undefined,
    rate: 0,
    image: ''
  };

  ngOnInit(): void {
    // Calcul de la limite futuriste (+5 ans)
    const future = new Date();
    future.setFullYear(future.getFullYear() + 5); 
    this.maxLimitDate = future.toISOString().split('T')[0];

    // Chargement du film
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.moviesApi.getMovie(id).subscribe({
        next: (movie) => {
          this.movie = movie;
          // Formatage de la date pour l'input HTML
          if (this.movie.releaseDate) {
            this.movie.releaseDate = new Date(this.movie.releaseDate).toISOString().split('T')[0];
          }
        },
        error: (err) => {
          this.toaster.show('❌ Erreur lors du chargement du film');
          console.error(err);
        }
      });
    }
  }

  updateMovie(): void {
    // Vérification de sécurité pour la date
    const selectedDate = new Date(this.movie.releaseDate as string);
    const limitDate = new Date(this.maxLimitDate);
    const originDate = new Date(this.minDate);

    if (selectedDate > limitDate || selectedDate < originDate) {
      this.toaster.show('⚠️ Date invalide (max 5 ans dans le futur)');
      return;
    }

    // Si les champs obligatoires sont remplis
    if (this.movie.title?.trim() && this.movie.director?.trim()) {
      const updatedMovie: Movie = {
        ...this.movie,
        title: this.movie.title.trim(),
        director: this.movie.director.trim(),
        synopsis: this.movie.synopsis?.trim() || ''
      };

      this.moviesApi.updateMovie(updatedMovie).subscribe({
        next: () => {
          this.toaster.show('✅ Film mis à jour !');
          this.router.navigate(['/movies']);
        },
        error: (err) => {
          this.toaster.show('❌ Erreur lors de la modification');
          console.error(err);
        }
      });
    } else {
      this.toaster.show('⚠️ Veuillez remplir le titre et le réalisateur.');
    }
  }
}