// src/app/navbar/navbar.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
// import { ThemeService } from '../theme-service/theme-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  @Input({ required: true }) title!: string;

  expanded = false;   // toggle par clic
  hoverMenu = false;  // toggle par hover

  // Injection du service Auth
  constructor(public auth: AuthService /*, public themeService: ThemeService */) {}

  // Toggle menu hamburger
  toggleMenu(): void {
    this.expanded = !this.expanded;
  }

  // Méthode pour savoir si la navbar est "expand"
  isExpanded(): boolean {
    return this.expanded || this.hoverMenu;
  }

  // Toggle thème si tu actives ThemeService
  // toggleTheme(): void {
  //   this.themeService.toggleTheme();
  // }
}
