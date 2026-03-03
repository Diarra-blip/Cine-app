import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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
  hoverMenu = false;

  constructor(public auth: AuthService, private router: Router) {}

  toggleMenu(): void {
    this.expanded = !this.expanded;
  }

  isExpanded(): boolean {
    return this.expanded || this.hoverMenu;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
