import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/guards/authenticated.guard';
import { authRoutes } from './core/components/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/public-pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'auth',
    children: [...authRoutes],
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./modules/calendar/calendar-page.component').then(
        (m) => m.CalendarPageComponent,
      ),
    canActivate: [authenticatedGuard],
  },
];
