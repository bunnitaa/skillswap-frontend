import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../../services/review';

@Component({
  selector: 'app-submit-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './submit-review.html',
  styleUrl: './submit-review.scss'
})

export class SubmitReviewComponent { 
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);

  errorMessage: string = '';
  successMessage: string = '';
  jobId: number = 1;

  reviewForm = this.fb.group({
    rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.required]
  });

  onSubmit() {
    if (this.reviewForm.invalid) {
      this.errorMessage = "Please provide a rating (1-5) and a comment.";
      return;
    }

    const reviewData = {
      rating: Number(this.reviewForm.value.rating),
      comment: this.reviewForm.value.comment!
    };

    this.reviewService.submitReview(this.jobId, reviewData).subscribe({
      next: () => {
        this.successMessage = "Review submitted!";
        this.reviewForm.reset();
      },
      error: (err: any) => { 
        this.errorMessage = err.error?.error || "Failed to submit review.";
      }
    });
  }
}