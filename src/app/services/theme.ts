import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(true);

  constructor() {
    // Récupère le thème sauvegardé
    const saved = localStorage.getItem('theme');
    this.isDark.set(saved !== 'light');
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark.set(!this.isDark());
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDark()) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}
