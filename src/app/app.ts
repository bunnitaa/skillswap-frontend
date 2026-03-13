import { Component } from '@angular/core';
import { SubmitProposalComponent } from './components/proposals/submit-proposal/submit-proposal';
import { SubmitReviewComponent } from './components/reviews/submit-review/submit-review';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SubmitProposalComponent, SubmitReviewComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App { 
  title = 'skillswap-frontend';
}