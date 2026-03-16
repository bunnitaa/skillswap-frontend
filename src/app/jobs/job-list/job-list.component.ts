import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobsService } from '../jobs.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  
  categoryFilter: string = '';
  statusFilter: string = 'open';
  minBudgetFilter: number | null = null;

  constructor(
    private jobsService: JobsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    const filters: any = {};
    if (this.categoryFilter) filters.category = this.categoryFilter;
    if (this.statusFilter) filters.status = this.statusFilter;
    if (this.minBudgetFilter !== null && this.minBudgetFilter !== undefined) {
      filters.min_budget = this.minBudgetFilter;
    }

    this.jobsService.searchJobs(filters).subscribe({
      next: (res) => {
        this.jobs = res;
        this.isLoading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to load jobs';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    this.loadJobs();
  }
}
