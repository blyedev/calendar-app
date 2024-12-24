import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import {
  AuthenticatedResponse,
  ConfigurationResponse,
  NotAuthenticatedResponse,
  SessionResponse,
} from '../models/auth-responses.models';
import { EmailCredentials, UsernameCredentials } from '../models/auth.models';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = new URL(environment.authUrl, window.location.origin);
  constructor(
    private http: HttpClient,
    private logger: LoggingService,
  ) {}

  public fetchConfig() {
    const url = new URL('browser/v1/config', this.authUrl);
    return this.http
      .get<ConfigurationResponse>(url.pathname, { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
      );
  }

  public fetchSession(): Observable<SessionResponse> {
    const url = new URL('browser/v1/auth/session', this.authUrl);
    return this.http
      .get<AuthenticatedResponse>(url.pathname, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response.body!;
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return of(error.error as NotAuthenticatedResponse);
          }
          if (error.status === 410) {
            this.logger.error('Untested 4XX or 5XX status code');
            return of(error.error as NotAuthenticatedResponse);
          }
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
      );
  }

  public deleteSession() {
    const url = new URL('browser/v1/auth/session', this.authUrl);
    return this.http.delete(url.pathname, { observe: 'response' }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return of(error.error as NotAuthenticatedResponse);
        }
        this.logger.error('Unexpected 4XX or 5XX status code');
        throw error;
      }),
    );
  }

  public loginByUsername(credentials: UsernameCredentials) {
    return this.login(credentials);
  }

  public loginByEmail(credentials: EmailCredentials) {
    return this.login(credentials);
  }

  private login(credentials: UsernameCredentials | EmailCredentials) {
    const url = new URL('browser/v1/auth/login', this.authUrl);
    return this.http.post(url.pathname, credentials, { observe: 'response' });
  }
}
