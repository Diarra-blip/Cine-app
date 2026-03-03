import { Routes } from '@angular/router';
import { Home } from './home/home';
import { MoviesList } from './movies-list/movies-list';
import { AddMovie } from './add-movie/add-movie';
import { EditMovie } from './edit-movie/edit-movie';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Profile } from './profile/profile';
import { Charts } from './charts/charts';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: MoviesList },
  { path: 'add-movie', component: AddMovie },
  { path: 'edit-movie/:id', component: EditMovie },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'charts', component: Charts },
];
