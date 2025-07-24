import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../services/auth'; // Adjust path if needed

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  providers: [ReservationService],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css'],
})
export class Reservations implements OnInit {
  title = 'ReservationManager';
  public reservations: Reservation[] = [];
  reservation: Reservation = {
    location: '',
    start_time: '',
    end_time: '',
    reserved: false,
    imageName: ''
  };

  error = '';
  success = '';
  selectedFile: File | null = null;
  userName = '';

  constructor(
    private reservationService: ReservationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public authService: Auth // ✅ Add this
  ) {}

  ngOnInit(): void {
    this.getReservations();
    this.userName = localStorage.getItem('username') || 'Guest';
    this.cdr.detectChanges();
  }

  getReservations(): void {
    this.reservationService.getAll().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.success = 'successful list retrieval';
        console.log('successful list retrieval');
        console.log(this.reservations);
        this.cdr.detectChanges();
      },
      (err) => {
        console.log(err);
        this.error = 'error retrieving reservations';
      }
    );
  }

  addReservation(f: NgForm) {
    this.resetAlerts();

    if (this.selectedFile) {
      this.reservation.imageName = this.selectedFile.name;
      this.uploadFile();
    } else {
      this.reservation.imageName = '';
    }

    this.reservationService.add(this.reservation).subscribe(
      (res: Reservation) => {
        this.reservations.push(res);
        this.success = 'Successfully created';
        f.reset();
        this.selectedFile = null;
      },
      (err) => (this.error = err.message)
    );
  }

  deleteReservation(id: number) {
    console.log('Delete clicked for ID:', id);
    this.resetAlerts();
    this.reservationService.delete(id).subscribe(
      (res) => {
        this.reservations = this.reservations.filter((item) => {
          return item['id'] && +item['id'] !== +id;
        });
        this.cdr.detectChanges();
        this.success = 'Deleted successfully';
      },
      (err) => (this.error = err.message)
    );
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost/angularapp2/reservationsapi/upload', formData).subscribe(
      (response) => console.log('File uploaded successfully: ', response),
      (error) => console.error('File upload failed: ', error)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }
}
 
