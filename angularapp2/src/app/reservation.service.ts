import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root',
})

export class ReservationService {
  baseUrl = 'http://localhost/angularapp2/reservationsapi';

  constructor(private http: HttpClient) {
    // no statements required
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/list.php`).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }
  
  get(id: number) {
    return this.http.get<Reservation>(`http://localhost/angularapp2/reservationsapi/get.php?id=${id}`);
  }

  add(reservation: Reservation) {
    return this.http.post(`${this.baseUrl}/add`, {data: reservation}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  edit(reservation: Reservation) {
    return this.http.put(`${this.baseUrl}/edit`, {data: reservation});
  }

  delete(id: any) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.baseUrl}/delete`, {params: params});
  }
}