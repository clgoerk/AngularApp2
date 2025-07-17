import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  standalone: true,
  selector: 'app-addreservations',
  templateUrl: './addreservations.html',
  styleUrls: ['./addreservations.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [ReservationService]
})
export class Addreservations {
  reservation: Reservation = { location: '', start_time: '', end_time: '', reserved: false, imageName: '' };
  selectedFile: File | null = null;
  error = '';
  success = '';

  constructor(
    private reservationService: ReservationService,
    private http: HttpClient,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  addReservation(f: NgForm) {
    this.resetAlerts();

    if (!this.reservation.imageName) {
      this.reservation.imageName = 'placeholder.jpg';
    }

    this.reservationService.add(this.reservation).subscribe(
      (res: Reservation) => {
        this.success = 'Successfully created';

        // Upload image only if not placeholder
        if (this.selectedFile && this.reservation.imageName !== 'placeholder.jpg') {
          this.uploadFile();
        }

        f.resetForm();
        this.selectedFile = null;
        this.router.navigate(['/reservations']);
      },
      (err) => {
        this.error = err.error?.message || err.message || 'Error occurred';
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
      this.selectedFile = input.files[0];
      this.reservation.imageName = this.selectedFile.name;
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
