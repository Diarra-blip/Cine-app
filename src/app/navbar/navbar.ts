import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  @Input({ required: true }) title!: string;
  expanded = false;

  auth = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  toggleMenu(): void {
    this.expanded = !this.expanded;
  }

  closeMenu(): void {
    this.expanded = false;
  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
