import { Routes } from '@angular/router';
import { About } from './about/about';
import { Reservations } from './reservations/reservations'; 

export const routes: Routes = [
  { path: "reservations", component: Reservations },  
  { path: "about", component: About },
  { path: "**", redirectTo: "/reservations" }  
];