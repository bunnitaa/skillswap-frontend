import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../core/services/proposal';
@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bids.html',
  styles: [] 
})
export class MyBidsComponent implements OnInit {
  private proposalService: ProposalService = inject(ProposalService);
  bids: any[] = [];

  ngOnInit(): void {
    this.loadBids();
  }

  loadBids(): void {
    this.proposalService.getMyBids().subscribe({
      next: (data: any) => {
        this.bids = data;
        console.log('Bids loaded successfully:', data);
      },
      error: (err: any) => {
        console.error('Error loading bids:', err);
      }
    });
  }
}