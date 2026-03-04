import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Movie } from '../models/movie';
import { MoviesApiService } from '../services/movies-api';
import { ToasterService } from '../services/toaster';

@Component({
  selector: 'app-edit-movie',
  imports: [FormsModule],
  templateUrl: './edit-movie.html',
  styleUrl: './edit-movie.scss'
})
export class EditMovie implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toaster = inject(ToasterService);

  movie: Movie = {
    title: '',
    director: '',
    releaseDate: new Date(),
    synopsis: '',
    id: undefined,
    rate: undefined,
    image: undefined,
    category: ''
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.moviesApi.getMovie(id).subscribe(movieFromServer => {
      this.movie = { ...movieFromServer, category: movieFromServer.category || '' };
    });
  }

  updateMovie(): void {
    this.moviesApi.updateMovie(this.movie).subscribe(() => {
      this.toaster.show('Film mis à jour !');
      this.router.navigate(['/movies']);
    });
  }
}
