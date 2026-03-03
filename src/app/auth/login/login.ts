import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  error = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (this.auth.login(this.email, this.password)) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Email ou mot de passe incorrect';
    }
  }
}
