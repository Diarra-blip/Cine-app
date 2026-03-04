import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Toaster } from "./toaster/toaster";
import { ThemeService } from './services/theme';
// 1. Ajoute cet import
import { TitleCasePipe } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true, // Assure-toi que c'est bien là
  // 2. Ajoute TitleCasePipe ici
  imports: [RouterOutlet, Navbar, Toaster, TitleCasePipe], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('vatalina');
  private themeService = inject(ThemeService);

  ngOnInit() {
    this.themeService['applyTheme']();
  }
}