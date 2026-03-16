import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobsService } from '../jobs.service';
import { AuthService } from '@teammate/core/services/auth.service';

import { ProposalService } from '../../../../skillswap-frontend-main/skillswap-frontend-main/src/app/services/proposal.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  job: any;
  proposals: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  currentUserId: string | null = null;
  isAccepting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService,
    private authService: AuthService,
    private proposalService: ProposalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        this.currentUserId = payload.userId || payload.sub || payload.id;
      } catch (e) {
        console.error('DEBUG: Token decode failed', e);
      }
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJobDetails(id);
    } else {
      this.errorMessage = 'Invalid job ID';
      this.isLoading = false;
    }
  }

  isOwner(): boolean {
    if (!this.job || !this.currentUserId) return false;
    const ownerId = this.job.owner?.id || this.job.owner?._id || this.job.owner;
    return String(ownerId) === String(this.currentUserId);
  }

  loadJobDetails(id: string): void {
    this.jobsService.getJob(id).subscribe({
      next: (res) => {
        this.job = res;
        this.isLoading = false;

        if (this.isOwner()) {
          this.loadProposals(id);
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to load job details';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProposals(jobId: string): void {
    this.proposalService.getJobProposals(jobId).subscribe({
      next: (res) => {
        console.log('DEBUG: Proposals retrieved:', res);
        this.proposals = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load proposals:', err);
      }
    });
  }

  acceptBid(bidId: string): void {
    if (this.isAccepting) return;

    if (confirm('Are you sure you want to accept this proposal? This will close the job.')) {
      this.isAccepting = true;
      this.proposalService.acceptProposal(bidId).subscribe({
        next: () => {
          alert('Proposal accepted successfully!');
          this.job.status = 'closed';
          // Reload proposals to show updated status
          if (this.job.id || this.job._id) {
            this.loadProposals(this.job.id || this.job._id);
          }
          this.isAccepting = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err.error?.error || 'Failed to accept proposal');
          this.isAccepting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  completeJob(): void {
    const id = this.job.id || this.job._id;
    if (!this.job || !id) return;

    if (confirm('Are you sure you want to mark this job as completed?')) {
      this.jobsService.completeJob(id).subscribe({
        next: (res) => {
          this.job.status = 'completed';
          alert('Job marked as completed successfully!');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Failed to complete job';
          alert(this.errorMessage);
          this.cdr.detectChanges();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}
