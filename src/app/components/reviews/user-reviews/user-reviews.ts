import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../../core/services/review';

@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-reviews.html',
  styleUrl: './user-reviews.scss'
})
export class UserReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private route = inject(ActivatedRoute);

  userId: number = 0;
  reviews: any[] = [];
  errorMessage: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadReviews();
      }
    });
  }

  loadReviews() {
    this.reviewService.getUserReviews(this.userId).subscribe({
      next: (data: any) => this.reviews = data,
      error: (err: any) => this.errorMessage = "Could not load reviews."
    });
  }
}