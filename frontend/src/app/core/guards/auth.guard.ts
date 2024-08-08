import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth$.pipe(
    map((isAuth: boolean) => {
      const redirect = isAuth ? true : router.parseUrl('/login');
      return redirect;
    }),
  );
};
