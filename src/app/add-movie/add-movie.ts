import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
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
  private readonly http = inject(HttpClient); 

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
    const future = new Date();
    future.setFullYear(future.getFullYear() + 5);
    this.maxLimitDate = future.toISOString().split('T')[0];
  }

  searchMovie(): void {
    const apiKey = '59c88170'; // Ta clé activée ✨
    const title = this.movie.title.trim();

    if (title.length > 2) {
      const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

      this.http.get(url).subscribe({
        next: (data: any) => {
          if (data.Response === 'True') {
            // Mise à jour de l'objet avec les données réelles
            this.movie = {
              ...this.movie,
              image: data.Poster !== 'N/A' ? data.Poster : '',
              director: data.Director !== 'N/A' ? data.Director : '',
              synopsis: data.Plot !== 'N/A' ? data.Plot : '',
            };

            // Conversion de la date OMDb (ex: "18 Dec 2009") pour l'input date HTML
            if (data.Released && data.Released !== 'N/A') {
              const dateParsed = new Date(data.Released);
              if (!isNaN(dateParsed.getTime())) {
                this.movie.releaseDate = dateParsed.toISOString().split('T')[0];
              }
            }
            this.toaster.show('🎬 Film trouvé ! Les champs ont été remplis.');
          } else {
            this.toaster.show('⚠️ Film non trouvé (essayez le titre en anglais).');
          }
        },
        error: (err) => {
          console.error('Erreur OMDb :', err);
          this.toaster.show('❌ Problème de connexion à l\'API.');
        }
      });
    }
  }

  addMovie(): void {
    if (this.movie.title.trim() && this.movie.director.trim() && this.movie.synopsis.trim().length >= 30) {
      this.moviesApi.addMovie(this.movie).subscribe({
        next: () => {
          this.toaster.show('✅ Film enregistré avec succès !');
          this.router.navigate(['/']); 
        },
        error: (err) => {
          this.toaster.show('❌ Erreur lors de l\'enregistrement sur le serveur.');
          console.error(err);
        }
      });
    } else {
      this.toaster.show('⚠️ Veuillez remplir tous les champs (synopsis min. 30 car.).');
    }
  }
}
