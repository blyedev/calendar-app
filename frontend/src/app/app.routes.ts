import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./modules/public-pages/home-page/home-page.component").then(m => m.HomePageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import("./modules/auth/login-page/login-page.component").then(m => m.LoginPageComponent),
  },
  {
    path: 'calendar',
    loadComponent: () => import("./modules/calendar/calendar-page/calendar-page.component").then(m => m.CalendarPageComponent),
    canActivate: [authGuard]
  },
];
