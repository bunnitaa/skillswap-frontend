import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProposalService } from '../../../core/services/proposal';

@Component({
  selector: 'app-job-proposals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-proposals.html',
  styleUrl: './job-proposals.scss'
})
export class JobProposalsComponent implements OnInit {
  private proposalService = inject(ProposalService);
  private route = inject(ActivatedRoute);

  jobId: number = 0;
  proposals: any[] = [];
  errorMessage: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.jobId = +id;
        this.loadProposals();
      }
    });
  }

  loadProposals() {
    this.proposalService.getJobProposals(this.jobId).subscribe({
      next: (data: any) => this.proposals = data,
      error: (err: any) => this.errorMessage = "Could not load proposals."
    });
  }

  acceptProposal(proposalId: number) {
    if(confirm("Are you sure you want to accept this proposal?")) {
      this.proposalService.acceptProposal(proposalId).subscribe({
        next: () => {
          alert("Proposal accepted!");
          this.loadProposals();
        },
        error: (err: any) => alert("Failed to accept proposal.")
      });
    }
  }
}