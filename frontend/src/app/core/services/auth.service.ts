import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  ReplaySubject,
  tap,
} from 'rxjs';
import {
  AuthenticatedResponse,
  ConfigurationResponse,
  ConflictResponse,
  ForbiddenResponse,
  InputErrorResponse,
  LoginRequest,
  LoginResponse,
  NotAuthenticatedResponse,
  SessionGoneResponse,
  SessionResponse,
  SignupRequest,
  SignupResponse,
} from '../models/auth-requests.models';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = new URL(environment.authUrl, window.location.origin);

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private userSubject = new BehaviorSubject<
    AuthenticatedResponse['data']['user'] | null
  >(null);
  public user = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private logger: LoggingService,
  ) {}

  public fetchConfig(): Observable<ConfigurationResponse> {
    const url = new URL('browser/v1/config', this.authUrl);
    return this.http
      .get<ConfigurationResponse>(url.pathname, { observe: 'response' })
      .pipe(
        map((response) => {
          return response.body!;
        }),
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
            return of(error.error as SessionGoneResponse);
          }
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap((response) => {
          if (response.status === 200) {
            this.handleAuthenticatedResponse(response);
          }
          if (response.status === 401) {
            this.handleNotAuthenticatedResponse(response);
          }
        }),
      );
  }

  public deleteSession(): Observable<NotAuthenticatedResponse> {
    const url = new URL('browser/v1/auth/session', this.authUrl);
    return this.http.delete(url.pathname, { observe: 'response' }).pipe(
      map(() => {
        const error = new Error(
          'Expected a 401 status code indicating a session no longer exists',
        );
        this.logger.error(error);
        throw error;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return of(error.error as NotAuthenticatedResponse);
        }
        this.logger.error('Unexpected 4XX or 5XX status code');
        throw error;
      }),
      tap((response) => {
        if (response.status === 401) {
          this.handleNotAuthenticatedResponse(response);
        }
      }),
    );
  }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    const url = new URL('browser/v1/auth/login', this.authUrl);
    return this.http
      .post<AuthenticatedResponse>(url.pathname, credentials, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response.body!;
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return of(error.error as InputErrorResponse<typeof credentials>);
          }
          if (error.status === 401) {
            return of(error.error as NotAuthenticatedResponse);
          }
          if (error.status === 409) {
            return of(error.error as ConflictResponse);
          }
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap((response) => {
          if (response.status === 200) {
            this.handleAuthenticatedResponse(response);
          }
          if (response.status === 401) {
            this.handleNotAuthenticatedResponse(response);
          }
        }),
      );
  }

  public signup(credentials: SignupRequest): Observable<SignupResponse> {
    const url = new URL('browser/v1/auth/signup', this.authUrl);
    return this.http
      .post<AuthenticatedResponse>(url.pathname, credentials, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response.body!;
          }
          throw new Error('Unexpected 2XX status code');
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return of(error.error as InputErrorResponse<typeof credentials>);
          }
          if (error.status === 401) {
            return of(error.error as NotAuthenticatedResponse);
          }
          if (error.status === 403) {
            return of(error.error as ForbiddenResponse);
          }
          if (error.status === 409) {
            return of(error.error as ConflictResponse);
          }
          this.logger.error('Unexpected 4XX or 5XX status code');
          throw error;
        }),
        tap((response) => {
          if (response.status === 200) {
            this.handleAuthenticatedResponse(response);
          }
          if (response.status === 401) {
            this.handleNotAuthenticatedResponse(response);
          }
        }),
      );
  }

  private handleAuthenticatedResponse(response: AuthenticatedResponse) {
    this.logger.debug('Auth Service updates state an authenticated response');
    this.isAuthenticatedSubject.next(response.meta.is_authenticated);
    this.userSubject.next(response.data.user);
  }

  private handleNotAuthenticatedResponse(response: NotAuthenticatedResponse) {
    this.logger.debug(
      'Auth Service updates state after a not authenticated response',
    );
    this.isAuthenticatedSubject.next(response.meta.is_authenticated);
    this.userSubject.next(null);
  }
}
