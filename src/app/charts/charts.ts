import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MoviesApiService } from '../services/movies-api';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.scss'
})
export class Charts implements OnInit {
  @ViewChild('rateChart', { static: true }) rateChartRef!: ElementRef;
  @ViewChild('yearChart', { static: true }) yearChartRef!: ElementRef;

  private readonly moviesApi = inject(MoviesApiService);

  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe(movies => {
      this.createRateChart(movies);
      this.createYearChart(movies);
    });
  }

  createRateChart(movies: any[]): void {
    new Chart(this.rateChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: movies.map(m => m.title),
        datasets: [{
          label: 'Note / 5',
          data: movies.map(m => m.rate),
          backgroundColor: [
            '#ffc107', '#17a2b8', '#28a745', '#dc3545', '#6f42c1',
            '#fd7e14', '#20c997', '#e83e8c', '#007bff', '#6610f2'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Notes des films', font: { size: 18 } }
        },
        scales: {
          y: { beginAtZero: true, max: 5 }
        }
      }
    });
  }

  createYearChart(movies: any[]): void {
    const years: { [key: string]: number } = {};
    movies.forEach(m => {
      const year = new Date(m.releaseDate).getFullYear().toString();
      years[year] = (years[year] || 0) + 1;
    });

    const sortedYears = Object.keys(years).sort();

    new Chart(this.yearChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: sortedYears,
        datasets: [{
          label: 'Nombre de films',
          data: sortedYears.map(y => years[y]),
          backgroundColor: [
            '#ffc107', '#17a2b8', '#28a745', '#dc3545', '#6f42c1',
            '#fd7e14', '#20c997', '#e83e8c', '#007bff', '#6610f2'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Films par année de sortie', font: { size: 18 } }
        }
      }
    });
  }
}