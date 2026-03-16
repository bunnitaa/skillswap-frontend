import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private http = inject(HttpClient);

  createJob(jobData: any): Observable<any> {
    return this.http.post(`/jobs`, jobData);
  }

  searchJobs(filters: any): Observable<any> {
    return this.http.post(`/jobs/search`, filters);
  }

  getJob(id: string): Observable<any> {
    return this.http.get(`/jobs/${id}`);
  }

  getMyPostings(): Observable<any> {
    return this.http.get(`/jobs/my-postings`);
  }

  updateJob(id: string, jobData: any): Observable<any> {
    return this.http.patch(`/jobs/${id}`, jobData);
  }

  completeJob(id: string): Observable<any> {
    return this.http.patch(`/jobs/${id}/complete`, {});
  }
}
