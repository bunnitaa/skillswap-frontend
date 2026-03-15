import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private http = inject(HttpClient);
  private baseUrl = '';

  submitProposal(jobId: number, data: { price: number; cover_letter: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/jobs/${jobId}/proposals`, data);
  }

  getJobProposals(jobId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/jobs/${jobId}/proposals`);
  }

  acceptProposal(proposalId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/proposals/${proposalId}/accept`, {});
  }

  getMyBids(): Observable<any> {
    return this.http.get(`${this.baseUrl}/proposals/my-bids`);
  }

  deleteProposal(proposalId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/proposals/${proposalId}`);
  }
}