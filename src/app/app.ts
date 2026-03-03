import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Toaster } from "./toaster/toaster";
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('vatalina');
  private themeService = inject(ThemeService);

  ngOnInit() {
    // Force l'application du thème au démarrage
    this.themeService['applyTheme']();
  }
}
