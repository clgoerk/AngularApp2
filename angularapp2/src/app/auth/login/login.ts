import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  userName = '';
  password = '';
  errorMessage = '';
  lockoutTimer: any = null;
  remainingSeconds: number = 0;

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  login() {
    this.auth.login({ userName: this.userName, password: this.password }).subscribe({
      next: res => {
        if (res.success) {
          this.clearLockoutTimer();
          this.auth.setAuth(true);
          localStorage.setItem('username', this.userName);
          this.router.navigate(['/contacts']);
        } else {
          this.errorMessage = res.message || 'Login failed. Please try again.';
        }
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = 'Server error during login. Please try again.';

        if (err.status === 403) {
          const msg = err.error?.error || 'Account locked. Please wait.';
          this.errorMessage = msg;

          const match = msg.match(/in (\d+) minute/);
          if (match) {
            const minutes = parseInt(match[1], 10);
            this.remainingSeconds = minutes * 60;
            this.startLockoutCountdown();
          }
        } 
        else if (err.status === 401) {
          const remaining = err.error?.remainingAttempts ?? null;
          if (remaining !== null && remaining > 0) {
            this.errorMessage = `Invalid username or password. You have ${remaining} attempt(s) remaining before lockout.`;
          } else {
            this.errorMessage = 'Invalid username or password.';
          }
        } 
        else if (err.status === 404) {
          this.errorMessage = 'User not found.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  /** Starts a countdown timer that updates the lockout message every second */
  startLockoutCountdown() {
    this.clearLockoutTimer();

    this.lockoutTimer = setInterval(() => {
      if (this.remainingSeconds > 0) {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        this.errorMessage = `Account locked. Try again in ${minutes}:${seconds.toString().padStart(2, '0')} minute(s).`;
        this.remainingSeconds--;
      } else {
        this.clearLockoutTimer();
        this.errorMessage = '';
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  /** Clears any active countdown timer */
  clearLockoutTimer() {
    if (this.lockoutTimer) {
      clearInterval(this.lockoutTimer);
      this.lockoutTimer = null;
    }
  }
}