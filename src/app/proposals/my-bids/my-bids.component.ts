import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProposalService } from '../../../../skillswap-frontend-main/skillswap-frontend-main/src/app/services/proposal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
<div class="my-bids-container" style="max-width: 800px; margin: 20px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
  <h2 style="border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; color: #007bff;">My Project Bids</h2>
  
  <div *ngIf="bids.length === 0" style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px; border: 1px dashed #ccc;">
    <p style="font-size: 1.1em; color: #666;">You haven't submitted any bids yet.</p>
    <a routerLink="/jobs" style="color: #007bff; text-decoration: none; font-weight: bold;">Browse Jobs &rarr;</a>
  </div>

  <div *ngIf="bids.length > 0" class="bids-list" style="display: flex; flex-direction: column; gap: 15px;">
    <div *ngFor="let bid of bids" class="bid-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.2s;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
        <h3 style="margin: 0; color: #2c3e50;">{{ bid.job?.title || 'Job ID: ' + bid.job }}</h3>
        <span [ngClass]="bid.status" style="padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: bold; text-transform: uppercase;"
              [style.background-color]="bid.status === 'accepted' ? '#e6ffe6' : (bid.status === 'pending' ? '#fff4e6' : '#f8f9fa')"
              [style.color]="bid.status === 'accepted' ? '#28a745' : (bid.status === 'pending' ? '#d97706' : '#666')">
          {{ bid.status }}
        </span>
      </div>
      
      <div style="margin-bottom: 15px;">
        <span style="font-weight: bold; color: #007bff; font-size: 1.2em;">\${{ bid.price }}</span>
      </div>

      <div style="background: #fdfdfd; padding: 10px; border-radius: 4px; border-left: 3px solid #007bff;">
        <p style="margin: 0; font-style: italic; color: #555; white-space: pre-wrap;">"{{ bid.cover_letter }}"</p>
      </div>

      <div style="margin-top: 15px; font-size: 0.9em; color: #888;">
        Submitted on: {{ (bid.createdAt || bid.date) | date:'mediumDate' }}
      </div>
    </div>
  </div>
</div>
  `,
  styles: []
})
export class MyBidsComponent implements OnInit {
  bids: any[] = [];

  constructor(
    private proposalService: ProposalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadBids();
  }

  loadBids(): void {
    this.proposalService.getMyBids().subscribe({
      next: (data: any) => {
        this.bids = data;
        console.log('Bids loaded successfully:', data);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading bids:', err);
        this.cdr.detectChanges();
      }
    });
  }
}
