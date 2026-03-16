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
    return this.http.post(`/jobs/${jobId}/proposals`, data);
  }

  getJobProposals(jobId: number): Observable<any> {
    return this.http.get(`/jobs/${jobId}/proposals`);
  }

  acceptProposal(proposalId: number): Observable<any> {
    return this.http.patch(`/proposals/${proposalId}/accept`, {});
  }

  getMyBids(): Observable<any> {
    return this.http.get(`/proposals/my-bids`);
  }

  deleteProposal(proposalId: number): Observable<any> {
    return this.http.delete(`/proposals/${proposalId}`);
  }
}