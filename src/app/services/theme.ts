import { Injectable, signal } from '@angular/core';

export type ThemeName = 'dark' | 'light' | 'ocean' | 'purple';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(true);
  currentTheme = signal<ThemeName>('dark');

  themes: { name: ThemeName; label: string; emoji: string }[] = [
    { name: 'dark',   label: 'Sombre',  emoji: '🌙' },
    { name: 'light',  label: 'Clair',   emoji: '☀️' },
    { name: 'ocean',  label: 'Océan',   emoji: '🌊' },
    { name: 'purple', label: 'Violet',  emoji: '💜' },
  ];

  constructor() {
    const saved = localStorage.getItem('theme') as ThemeName || 'dark';
    this.currentTheme.set(saved);
    this.isDark.set(saved !== 'light');
    this.applyTheme();
  }

  toggleTheme() {
    // Cycle entre les thèmes
    const names: ThemeName[] = ['dark', 'light', 'ocean', 'purple'];
    const current = names.indexOf(this.currentTheme());
    const next = names[(current + 1) % names.length];
    this.setTheme(next);
  }

  setTheme(theme: ThemeName) {
    this.currentTheme.set(theme);
    this.isDark.set(theme !== 'light');
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  public applyTheme() {
    const theme = this.currentTheme();
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-bs-theme', theme === 'light' ? 'light' : 'dark');
  }

  getThemeEmoji(): string {
    return this.themes.find(t => t.name === this.currentTheme())?.emoji || '🌙';
  }
}
