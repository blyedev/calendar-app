import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { LoggingService } from '../services/logging.service';

export const notAuthenticatedGuard: CanActivateFn = (_route, _state) => {
  const logger = inject(LoggingService);
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        logger.debug('Not Authenticated Guard: Redirecting to profile page');
        return router.parseUrl('/auth/profile');
      }
      return true;
    }),
  );
};
