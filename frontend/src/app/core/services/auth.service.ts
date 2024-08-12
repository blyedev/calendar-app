import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AuthPingResponse,
  AuthResponse,
  Credentials,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  private isAuthSubject: ReplaySubject<boolean>;
  public isAuth$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.isAuthSubject = new ReplaySubject<boolean>(1);
    this.isAuth$ = this.isAuthSubject.asObservable();
  }

  checkSession(): Observable<AuthPingResponse> {
    const endpoint = `${this.apiUrl}/check`;

    return this.http.get<AuthPingResponse>(endpoint).pipe(
      tap({
        next: (res: AuthPingResponse) => {
          this.isAuthSubject.next(res.is_authenticated);
        },
      }),
    );
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    const endpoint = `${this.apiUrl}/knox/login/`;

    return this.http.post<AuthResponse>(endpoint, credentials).pipe(
      tap({
        next: () => {
          this.isAuthSubject.next(true);
        },
        error: (error) => {
          if (error.status === 400 && error.error?.non_field_errors) {
            this.isAuthSubject.next(false);
          }
        },
      }),
    );
  }

  logout(): Observable<void> {
    const endpoint = `${this.apiUrl}/knox/logout/`;

    return this.http.post<void>(endpoint, null).pipe(
      tap({
        next: () => {
          this.isAuthSubject.next(false);
          this.router.navigate(['/login']);
        },
      }),
    );
  }
}
