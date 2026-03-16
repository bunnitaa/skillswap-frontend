import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../jobs.service';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss']
})
export class JobEditComponent implements OnInit {
  jobForm: FormGroup;
  jobId: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      budget: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      category: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id') || '';
    if (this.jobId) {
      this.loadJob(this.jobId);
    } else {
      this.errorMessage = 'Invalid job ID';
      this.isLoading = false;
    }
  }

  loadJob(id: string): void {
    this.jobsService.getJob(id).subscribe({
      next: (job) => {
        this.jobForm.patchValue({
          title: job.title,
          description: job.description,
          budget: job.budget,
          category: job.category,
          status: job.status
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to load job details';
        this.isLoading = false;
      }
    });
  }

  submitJob(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    this.jobsService.updateJob(this.jobId, this.jobForm.value).subscribe({
      next: () => {
        this.router.navigate(['/jobs', this.jobId]);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to update job';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/jobs', this.jobId]);
  }
}
