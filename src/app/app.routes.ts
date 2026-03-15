import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { SubmitProposalComponent } from './components/proposals/submit-proposal/submit-proposal';
import { MyBidsComponent } from './components/proposals/my-bids/my-bids';
import { SubmitReviewComponent } from './components/reviews/submit-review/submit-review';
import { JobProposalsComponent } from './components/proposals/job-proposals/job-proposals';
import { UserReviewsComponent } from './components/reviews/user-reviews/user-reviews';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard] 
  },
  { path: 'my-bids', component: MyBidsComponent, canActivate: [authGuard] },
  { path: 'submit-proposal/:id', component: SubmitProposalComponent, canActivate: [authGuard] },
  { path: 'job-proposals/:id', component: JobProposalsComponent, canActivate: [authGuard] },
  { path: 'submit-review/:id', component: SubmitReviewComponent, canActivate: [authGuard] }
];