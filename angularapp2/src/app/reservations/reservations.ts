import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ReservationService],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css'],
})
export class Reservations implements OnInit {
  title = 'ReservationManager';
  public reservations: Reservation[] = [];
  reservation: Reservation = { location: '', start_time: '', end_time: '', reserved: false, imageName: '' };

  error = '';
  success = '';

  constructor(private reservationService: ReservationService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getReservations();
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
    if (!this.reservation.location || !this.reservation.start_time || !this.reservation.end_time) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.reservationService.add(this.reservation).subscribe(
      (res) => {
        this.success = 'Reservation added successfully';
        this.getReservations();
        f.resetForm();
      },
      (err) => {
        console.log(err);
        this.error = 'Failed to add reservation';
      }
    );
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
 
