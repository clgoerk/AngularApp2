import { About } from './about/about';
import { Routes } from '@angular/router';
import { Reservations } from './reservations/reservations'; 
import { Addreservations } from './addreservations/addreservations';
import { Editreservations } from './editreservations/editreservations';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'reservations', component: Reservations, canActivate: [authGuard] },
  { path: "add", component: Addreservations, canActivate: [authGuard] },
  { path: 'edit/:id', component: Editreservations, canActivate: [authGuard] }, 
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '/reservations', pathMatch: 'full' }
];