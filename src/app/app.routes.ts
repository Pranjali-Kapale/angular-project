import { Routes } from '@angular/router';
import { LoginComponent } from './login-page/login-page';
import { Admin } from './admin/admin';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: 'login' }
];