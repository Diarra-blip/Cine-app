import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  user: User = { firstName: '', lastName: '', email: '', password: '' };
  confirmPassword = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (this.user.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }
    this.auth.register(this.user);
    this.router.navigate(['/login']);
  }
}
