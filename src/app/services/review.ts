import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = 'https://stingray-app-wxhhn.ondigitalocean.app';

  submitReview(jobId: number, data: { rating: number; comment: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/jobs/${jobId}/reviews`, data);
  }

  getUserReviews(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/reviews/user/${userId}`);
  }
}