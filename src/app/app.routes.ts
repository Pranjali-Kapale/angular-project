import { Routes } from '@angular/router';
import { LoginComponent } from './login-page/login-page';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];