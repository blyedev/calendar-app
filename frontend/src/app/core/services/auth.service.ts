import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private isAuthSubject: BehaviorSubject<boolean>;
  public isAuth$: Observable<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    this.isAuthSubject = new BehaviorSubject<boolean>(false);
    this.isAuth$ = this.isAuthSubject.asObservable();
  }

  login(credentials: { username: string, password: string }): void {
    const endpoint = `${this.apiUrl}/auth/login/`;
    this.http.post(endpoint, credentials)
      .subscribe({
        next: (x) => {
          console.log('Observer got a next value: ' + x);
          this.isAuthSubject.next(true);
        },
        error: (err) => {
          console.error('Observer got an error: ' + err)
        },
        complete: () => {
          console.log('Observer got a complete notification')
        },
      });
  }

  logout(): void {
    this.isAuthSubject.next(false);
    this.router.navigate(['/login']);
  }
}
