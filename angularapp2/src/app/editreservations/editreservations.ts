import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../reservation.service';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  standalone: true,
  selector: 'app-editreservations',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [ReservationService],
  templateUrl: './editreservations.html',
  styleUrls: ['./editreservations.css'],
})
export class Editreservations implements OnInit {
  form!: FormGroup;
  id!: number;
  originalImageName: string = 'placeholder.jpg';
  selectedFile: File | null = null;
  previewUrl: string = '';
  userName = '';
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    public authService: Auth,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.getAuth()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = localStorage.getItem('username') || 'Guest';
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.buildForm();

    this.reservationService.get(this.id).subscribe({
      next: (res: any) => {
        const normalized = {
          ...res,
          start_time: res.start_time.slice(0, 5),
          end_time: res.end_time.slice(0, 5),
          reserved: res.reserved === '1' || res.reserved === 1
        };

        this.form.patchValue(normalized);
        this.originalImageName = res.imageName || 'placeholder.jpg';
      },
      error: (err) => {
        this.error = 'Failed to load reservation.';
        this.success = '';
        this.cdr.detectChanges();
      },
    });
  }

  buildForm() {
    this.form = this.fb.group({
      location: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      reserved: [false],
    });
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
        this.previewUrl = '';
        this.cdr.detectChanges();
        return;
      }

      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.error = '';
    this.success = '';
    this.cdr.detectChanges();

    const formData = new FormData();
    formData.append('id', this.id.toString());
    formData.append('location', this.form.value.location);
    formData.append('start_time', this.form.value.start_time);
    formData.append('end_time', this.form.value.end_time);
    formData.append('reserved', this.form.value.reserved ? '1' : '0');
    formData.append('originalImageName', this.originalImageName);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.post('http://localhost/angularapp2/reservationsapi/edit.php', formData).subscribe({
      next: () => {
        this.success = 'Reservation updated successfully';
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to update reservation';
        this.success = '';
        this.cdr.detectChanges();
      },
    });
  }
}