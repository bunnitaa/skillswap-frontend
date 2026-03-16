import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobsService } from '../jobs.service';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-postings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-postings.component.html',
  styleUrls: ['./my-postings.component.scss']
})
export class MyPostingsComponent implements OnInit {
  myJobs: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  currentUserId: string | null = null;

  constructor(private jobsService: JobsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserId = payload.sub;
      } catch (e) {
        console.error('Failed to parse token');
      }
    }

    this.loadMyPostings();
  }

  loadMyPostings(): void {
    this.jobsService.getMyPostings().subscribe({
      next: (res) => {
        this.myJobs = res;
        this.isLoading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to load your postings.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  completeJob(job: any): void {
    if (job.status !== 'in_progress') return;

    if (confirm(`Are you sure you want to mark "${job.title}" as completed?`)) {
      this.jobsService.completeJob(job.id).subscribe({
        next: (res) => {
          job.status = 'completed';
          alert('Job marked as completed successfully!');
        },
        error: (err) => {
          const msg = err.error?.error || 'Failed to complete job';
          alert(msg);
        }
      });
    }
  }
}
