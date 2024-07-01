import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth$.pipe(
    take(1),
    map(isAuth => {
      return isAuth ? true : router.createUrlTree(['/login']);
    })
  );
};
