import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ViewTrackingService {

  incrementView(movieId: number): void {
    const key = `views_${movieId}`;
    const current = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (current + 1).toString());
  }

  getViews(movieId: number): number {
    return parseInt(localStorage.getItem(`views_${movieId}`) || '0');
  }

  getMostViewed(movies: any[], limit = 5): any[] {
    return [...movies]
      .map(m => ({ ...m, views: this.getViews(m.id) }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  getTopRated(movies: any[], limit = 5): any[] {
    return [...movies]
      .sort((a, b) => (b.rate || 0) - (a.rate || 0))
      .slice(0, limit);
  }
}
