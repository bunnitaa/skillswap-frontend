import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobsService } from '../jobs.service';
import { Router } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.scss']
})
export class JobCreateComponent {
  jobForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private jobsService: JobsService, private router: Router) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      budget: ['', [Validators.required, Validators.pattern(/\d+/)]],
      category: ['', Validators.required]
    });
  }

  submitJob() {
    if (this.jobForm.invalid) return;

    this.jobsService.createJob(this.jobForm.value).subscribe({
      next: res => { this.router.navigate(['/jobs/my-postings']); },
      error: err => { this.errorMessage = err.error?.error || 'Something went wrong'; }
    });
  }
}
