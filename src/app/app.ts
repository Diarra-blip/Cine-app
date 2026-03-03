import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Home } from "./home/home";
import { Toaster } from "./toaster/toaster";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Home, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('vatalina');
}