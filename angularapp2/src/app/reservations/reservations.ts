import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';

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
  reservation: Reservation = { location: '', start_time: '', end_time: '', reserved: false, imageName: '' };

  error = '';
  success = '';
  selectedFile: File | null = null;

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
  this.resetAlerts();

  if (this.selectedFile) {
    this.reservation.imageName = this.selectedFile.name;
    this.uploadFile(); // uploads the file
  } else {
    this.reservation.imageName = ''; // let the backend assign placeholder
  }

  this.reservationService.add(this.reservation).subscribe(
    (res: Reservation) => {
      this.reservations.push(res);
      this.success = 'Successfully created';
      f.reset();
      this.selectedFile = null; // reset file
    },
    (err) => (this.error = err.message)
  );
}

editReservation(location: any, start_time: any, end_time: any, reserved: boolean, id: any) {
  this.resetAlerts();
  this.reservationService.edit({
    location: location.value,
    start_time: start_time.value,
    end_time: end_time.value,
    reserved: reserved,
    id: +id
  }).subscribe(
    (res) => {
      this.cdr.detectChanges();
      this.success = 'Successfully edited';
    },
    (err) => {
      this.error = err.message;
    }
  );
}

deleteReservation(id: number) {
  console.log('Delete clicked for ID:', id); // <-- Add this
  this.resetAlerts();
  this.reservationService.delete(id).subscribe(
    (res) => {
      this.reservations = this.reservations.filter(function (item) {
        return item['id'] && +item['id'] !== +id;
      });
      this.cdr.detectChanges();
      this.success = 'Deleted successfully';
    },
    (err) => (this.error = err.message)
  );
}

uploadFile(): void {
  if (!this.selectedFile) {
    return;
  }
  const formData = new FormData();
  formData.append('image', this.selectedFile);

  this.http.post('http://localhost/angularapp2/reservationsapi/upload', formData).subscribe(
    response => console.log('File uploaded successfully: ', response),
    error => console.error('File upload failed: ', error)
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
}
 
