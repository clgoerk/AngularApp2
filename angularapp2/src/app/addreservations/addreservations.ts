import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { Auth } from '../services/auth';

@Component({
  standalone: true,
  selector: 'app-addreservations',
  templateUrl: './addreservations.html',
  styleUrls: ['./addreservations.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [ReservationService]
})
export class Addreservations implements OnInit {
  reservation: Reservation = { location: '', start_time: '', end_time: '', reserved: false, imageName: '' };
  selectedFile: File | null = null;
  error = '';
  success = '';
  userName = '';

  constructor(
    private reservationService: ReservationService,
    private http: HttpClient,
    public authService: Auth,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.getAuth()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = localStorage.getItem('username') || 'Guest';
  }

  addReservation(f: NgForm) {
    this.resetAlerts();
    this.cdr.detectChanges(); 

    if (!this.reservation.imageName) {
      this.reservation.imageName = 'placeholder.jpg';
    }

    this.reservationService.add(this.reservation).subscribe(
      (res: Reservation) => {
        this.success = 'Successfully created';
        this.error = '';
        this.cdr.detectChanges(); 

        if (this.selectedFile && this.reservation.imageName !== 'placeholder.jpg') {
          this.uploadFile();
        }

        f.resetForm();
        this.selectedFile = null;
        this.router.navigate(['/reservations']);
      },
      (err) => {
        if (err.status === 409 && err.error?.error) {
          this.error = err.error.error;
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = err.message || 'An error occurred';
        }

        this.success = '';
        this.cdr.detectChanges(); 
      }
    );
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost/angularapp2/reservationsapi/upload', formData).subscribe(
      response => console.log('File uploaded successfully:', response),
      error => console.error('File upload failed:', error)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        this.error = 'Only image files are allowed (JPG, PNG, GIF, WEBP)';
        this.success = '';
        this.selectedFile = null;
        this.cdr.detectChanges();
        return;
      }

      this.selectedFile = file;
      this.reservation.imageName = this.selectedFile.name;
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
