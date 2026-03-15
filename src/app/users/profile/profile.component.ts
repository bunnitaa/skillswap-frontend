import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user: any = null;

  constructor(private userService: UsersService) {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getMe().subscribe(
      (response) => {
        this.user = response;
      },
      (error) => {
        console.error('Error fetching profile', error);
      }
    );
  }

}