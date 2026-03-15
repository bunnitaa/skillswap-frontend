import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public authService = inject(AuthService);

  onLogout() {
    if(confirm("Are you sure you want to log out?")) {
      this.authService.logout();
    }
  }
}