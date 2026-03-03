import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(true);

  constructor() {
    const saved = localStorage.getItem('theme');
    this.isDark.set(saved !== 'light');
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark.set(!this.isDark());
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
    this.applyTheme();
  }

  public applyTheme() {
    document.body.setAttribute(
      'data-bs-theme',
      this.isDark() ? 'dark' : 'light'
    );
  }
}
