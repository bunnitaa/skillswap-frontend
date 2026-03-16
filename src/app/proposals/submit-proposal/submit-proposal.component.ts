import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProposalService } from '../../../../skillswap-frontend-main/skillswap-frontend-main/src/app/services/proposal.service';
import { JobsService } from '../../jobs/jobs.service';
import { AuthService } from '@teammate/core/services/auth.service';

@Component({
  selector: 'app-submit-proposal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div style="max-width: 500px; margin: 20px auto; font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <h2 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Submit a Proposal</h2>
  
  <div *ngIf="errorMessage" style="color: red; padding: 10px; background: #ffe6e6; border-radius: 4px; margin-bottom: 15px;">
    {{ errorMessage }}
  </div>

  <form (ngSubmit)="onSubmit()" #proposalForm="ngForm" style="display: flex; flex-direction: column; gap: 20px;">
    
    <div>
      <label for="price" style="display: block; font-weight: bold; margin-bottom: 5px;">Proposed Price ($)*</label>
      <input type="number" id="price" name="price" [(ngModel)]="price" required min="1" placeholder="Enter your bid price" 
             style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
    </div>

    <div>
      <label for="cover_letter" style="display: block; font-weight: bold; margin-bottom: 5px;">Cover Letter*</label>
      <textarea id="cover_letter" name="cover_letter" [(ngModel)]="coverLetter" required rows="6" 
                placeholder="Explain why you are the best candidate for this job..." 
                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
    </div>

    <button type="submit" [disabled]="proposalForm.invalid || isSubmitting" 
            style="padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1em;">
      {{ isSubmitting ? 'Submitting...' : 'Send Proposal' }}
    </button>
    
    <div style="text-align: center;">
      <a [routerLink]="['/jobs', jobId]" style="color: #666; text-decoration: none; font-size: 0.9em;">&larr; Cancel and go back</a>
    </div>
  </form>
</div>
  `,
  styles: []
})
export class SubmitProposalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proposalService = inject(ProposalService);
  private jobsService = inject(JobsService);
  private authService = inject(AuthService);

  jobId: string = '';
  price: number = 0;
  coverLetter: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id') || '';
    if (this.jobId) {
      this.checkOwnership();
    }
  }

  checkOwnership(): void {
    const currentUserId = this.authService.getUserId();
    this.jobsService.getJob(this.jobId).subscribe({
      next: (job) => {
        const ownerId = job.owner?.id || job.owner?._id || job.owner;
        if (String(ownerId) === String(currentUserId)) {
          alert('You cannot submit a proposal to your own job!');
          this.router.navigate(['/jobs', this.jobId]);
        }
      }
    });
  }

  onSubmit(): void {
    if (!this.jobId) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    this.proposalService.submitProposal(this.jobId, {
      price: this.price,
      cover_letter: this.coverLetter
    }).subscribe({
      next: () => {
        alert('Proposal submitted successfully!');
        this.router.navigate(['/my-bids']);
      },
      error: (err) => {
        console.error('Submission error:', err);
        this.errorMessage = err.error?.message || err.error?.error || 'Failed to submit proposal. Please check your connection.';
        this.isSubmitting = false;
      }
    });
  }
}
