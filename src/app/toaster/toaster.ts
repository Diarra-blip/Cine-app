import { Component, inject } from '@angular/core';
import { ToasterService } from '../services/toaster';

@Component({
  selector: 'app-toaster',
  imports: [],
  templateUrl: './toaster.html',
  styleUrl: './toaster.scss'
})
export class Toaster {
  toasterService = inject(ToasterService);
}