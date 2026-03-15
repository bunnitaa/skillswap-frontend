import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  suggestedUsername = '';

  registerForm = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    bio: ['', Validators.required],
    skills: ['', Validators.required] 
  });

  onSubmit() {
    this.errorMessage = '';
    this.suggestedUsername = '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    const rawValues = this.registerForm.value;

    const skillsArray = rawValues.skills
      ? rawValues.skills.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill !== '')
      : [];

    const payload = {
      name: rawValues.name,
      username: rawValues.username,
      email: rawValues.email,
      password: rawValues.password,
      bio: rawValues.bio,
      skills: skillsArray
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        alert('Registration successful! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('API ERROR:', err);

        if (err.status === 409 && err.error?.suggested_username) {
          this.errorMessage = err.error.error || 'Username is taken.';
          this.suggestedUsername = err.error.suggested_username;
        } 
        else {
          this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
        }
      }
    });
  }
}