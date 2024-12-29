import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { LoggingService } from '../services/logging.service';

export const authenticatedGuard: CanActivateFn = (_route, state) => {
  const logger = inject(LoggingService);
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }
      logger.debug('Authenticated Guard: Redirecting to login page');
      return router.parseUrl(
        `/auth/login?nextUrl=${encodeURIComponent(state.url)}`,
      );
    }),
  );
};
