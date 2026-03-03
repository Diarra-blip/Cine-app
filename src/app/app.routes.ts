import { Routes } from '@angular/router';
import { Home } from './home/home';
import { MoviesList } from './movies-list/movies-list';
import { AddMovie } from './add-movie/add-movie';
import { EditMovie } from './edit-movie/edit-movie';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Profile } from './profile/profile';
import { authGuard } from './auth/auth.guard';
import { Charts } from './charts/charts';
import { MovieDetail } from './movie-detail/movie-detail';
import { adminGuard } from './auth/admin.guard';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: MoviesList, canActivate: [adminGuard] },
  { path: 'add-movie', component: AddMovie, canActivate: [adminGuard] },
  { path: 'edit-movie/:id', component: EditMovie, canActivate: [adminGuard] },
  { path: 'charts', component: Charts, canActivate: [adminGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'movie/:id', component: MovieDetail, canActivate: [authGuard] },
];
