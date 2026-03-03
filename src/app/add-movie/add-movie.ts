import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
import { ToasterService } from '../services/toaster';

@Component({
  selector: 'app-add-movie',
  imports: [FormsModule],
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