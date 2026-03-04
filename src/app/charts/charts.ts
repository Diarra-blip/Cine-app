import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MoviesApiService } from '../services/movies-api';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  imports: [CommonModule],
  templateUrl: './charts.html',
  styleUrl: './charts.scss'
})
export class Charts implements OnInit {
  @ViewChild('rateChart', { static: true }) rateChartRef!: ElementRef;
  @ViewChild('yearChart', { static: true }) yearChartRef!: ElementRef;
  @ViewChild('directorChart', { static: true }) directorChartRef!: ElementRef;
  @ViewChild('rateDistChart', { static: true }) rateDistChartRef!: ElementRef;
  @ViewChild('topChart', { static: true }) topChartRef!: ElementRef;
  @ViewChild('timelineChart', { static: true }) timelineChartRef!: ElementRef;

  private readonly moviesApi = inject(MoviesApiService);

  totalMovies = 0;
  avgRate = 0;
  bestMovie = '';
  totalDirectors = 0;

  ngOnInit(): void {
    this.moviesApi.getMovies().subscribe(movies => {
      // Stats rapides
      this.totalMovies = movies.length;
      this.avgRate = Math.round(movies.reduce((a, m) => a + (m.rate || 0), 0) / movies.length * 10) / 10;
      this.bestMovie = movies.sort((a, b) => (b.rate || 0) - (a.rate || 0))[0]?.title || '';
      this.totalDirectors = new Set(movies.map(m => m.director)).size;

      this.createRateChart(movies);
      this.createYearChart(movies);
      this.createDirectorChart(movies);
      this.createRateDistChart(movies);
      this.createTopChart(movies);
      this.createTimelineChart(movies);
    });
  }

  private colors = [
    '#f5c518', '#ff9900', '#17a2b8', '#28a745',
    '#dc3545', '#6f42c1', '#fd7e14', '#20c997',
    '#e83e8c', '#007bff'
  ];

  createRateChart(movies: any[]): void {
    new Chart(this.rateChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: movies.map(m => m.title.length > 15 ? m.title.substring(0, 15) + '...' : m.title),
        datasets: [{
          label: 'Note / 5',
          data: movies.map(m => m.rate),
          backgroundColor: this.colors,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: '⭐ Notes des films', font: { size: 16, weight: 'bold' } }
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
          data: sortedYears.map(y => years[y]),
          backgroundColor: this.colors,
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: '📅 Films par année de sortie', font: { size: 16, weight: 'bold' } },
          legend: { position: 'bottom' }
        }
      }
    });
  }

  createDirectorChart(movies: any[]): void {
    const directors: { [key: string]: number } = {};
    movies.forEach(m => {
      directors[m.director] = (directors[m.director] || 0) + 1;
    });
    const sorted = Object.entries(directors).sort((a, b) => b[1] - a[1]).slice(0, 8);

    new Chart(this.directorChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: sorted.map(([d]) => d),
        datasets: [{
          label: 'Nombre de films',
          data: sorted.map(([, n]) => n),
          backgroundColor: this.colors,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: '🎬 Films par réalisateur', font: { size: 16, weight: 'bold' } }
        },
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  createRateDistChart(movies: any[]): void {
    const dist: { [key: string]: number } = { '0-1': 0, '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0 };
    movies.forEach(m => {
      const r = m.rate || 0;
      if (r <= 1) dist['0-1']++;
      else if (r <= 2) dist['1-2']++;
      else if (r <= 3) dist['2-3']++;
      else if (r <= 4) dist['3-4']++;
      else dist['4-5']++;
    });

    new Chart(this.rateDistChartRef.nativeElement, {
      type: 'polarArea',
      data: {
        labels: Object.keys(dist),
        datasets: [{
          data: Object.values(dist),
          backgroundColor: this.colors.slice(0, 5).map(c => c + 'bb'),
          borderColor: this.colors.slice(0, 5),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: '📊 Distribution des notes', font: { size: 16, weight: 'bold' } },
          legend: { position: 'bottom' }
        }
      }
    });
  }

  createTopChart(movies: any[]): void {
    const top = [...movies].sort((a, b) => (b.rate || 0) - (a.rate || 0)).slice(0, 5);

    new Chart(this.topChartRef.nativeElement, {
      type: 'radar',
      data: {
        labels: top.map(m => m.title.length > 12 ? m.title.substring(0, 12) + '...' : m.title),
        datasets: [{
          label: 'Note',
          data: top.map(m => m.rate),
          backgroundColor: 'rgba(245, 197, 24, 0.2)',
          borderColor: '#f5c518',
          borderWidth: 2,
          pointBackgroundColor: '#f5c518',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: '🏆 Top 5 des meilleurs films', font: { size: 16, weight: 'bold' } }
        },
        scales: {
          r: { beginAtZero: true, max: 5 }
        }
      }
    });
  }

  createTimelineChart(movies: any[]): void {
    const byYear: { [key: string]: number } = {};
    movies.forEach(m => {
      const year = new Date(m.releaseDate).getFullYear().toString();
      byYear[year] = (byYear[year] || 0) + 1;
    });
    const sortedYears = Object.keys(byYear).sort();
    // Cumul
    let cumul = 0;
    const cumulData = sortedYears.map(y => { cumul += byYear[y]; return cumul; });

    new Chart(this.timelineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: sortedYears,
        datasets: [{
          label: 'Films cumulés',
          data: cumulData,
          borderColor: '#f5c518',
          backgroundColor: 'rgba(245, 197, 24, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#f5c518',
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: '📈 Évolution du catalogue', font: { size: 16, weight: 'bold' } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }
}
