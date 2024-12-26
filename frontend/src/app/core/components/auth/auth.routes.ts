import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { authenticatedGuard } from '../../guards/authenticated.guard';
import { notAuthenticatedGuard } from '../../guards/not-authenticated.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [notAuthenticatedGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [notAuthenticatedGuard],
  },
];
