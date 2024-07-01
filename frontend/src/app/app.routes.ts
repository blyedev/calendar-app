import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./home-page/home-page.component").then(m => m.HomePageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import("./login-page/login-page.component").then(m => m.LoginPageComponent),
  },
  {
    path: 'calendar',
    loadComponent: () => import("./calendar-page/calendar-page.component").then(m => m.CalendarPageComponent),
    canActivate: [authGuard]
  },
];
