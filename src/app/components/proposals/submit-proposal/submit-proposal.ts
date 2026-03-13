import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProposalService } from '../../../services/proposal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submit-proposal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './submit-proposal.html',
  styleUrl: './submit-proposal.scss'
})
export class SubmitProposalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private proposalService = inject(ProposalService);
  private route = inject(ActivatedRoute);

  jobId: number = 1; 
  errorMessage: string = '';
  successMessage: string = '';

  proposalForm = this.fb.group({
    price: ['', [Validators.required, Validators.min(1)]],
    cover_letter: ['', Validators.required]
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.jobId = +id;
      }
    });
  }

  onSubmit() {
    if (this.proposalForm.invalid) {
      this.errorMessage = "Please fill out all fields correctly.";
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const proposalData = {
      price: Number(this.proposalForm.value.price),
      cover_letter: this.proposalForm.value.cover_letter!
    };

    this.proposalService.submitProposal(this.jobId, proposalData).subscribe({
      next: (response) => {
        this.successMessage = "Proposal submitted successfully!";
        this.proposalForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "An error occurred while submitting.";
      }
    });
  }
}