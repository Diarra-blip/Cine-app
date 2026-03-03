import { Routes } from '@angular/router';
import { Home } from './home/home';
import { MoviesList } from './movies-list/movies-list';
import { AddMovie } from './add-movie/add-movie';
import { EditMovie } from './edit-movie/edit-movie';
<<<<<<< HEAD
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Profile } from './profile/profile';
import { authGuard } from './auth/auth.guard';
=======
import { Charts } from './charts/charts';
>>>>>>> 4198a8928e450916a72c33e537e88ef2db886396

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: MoviesList },
  { path: 'add-movie', component: AddMovie },
  { path: 'edit-movie/:id', component: EditMovie },
<<<<<<< HEAD
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
=======
  { path: 'charts', component: Charts }
>>>>>>> 4198a8928e450916a72c33e537e88ef2db886396
];
