import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import {
  AuthPingResponse,
  AuthResponse,
  Credentials,
} from '../models/auth.models';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const routerSpy = { navigate: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkSession', () => {
    it('should check session and update isAuthSubject', () => {
      const dummyResponse: AuthPingResponse = { is_authenticated: true };

      service.checkSession().subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/check`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);

      service.isAuth$.subscribe((isAuth) => {
        expect(isAuth).toEqual(true);
      });
    });

    it('should handle checkSession errors and not update isAuthSubject', () => {
      let emittedValue: boolean | undefined;

      service.isAuth$.subscribe({
        next: (isAuth) => {
          emittedValue = isAuth;
        },
      });

      service.checkSession().subscribe({
        next: () => fail('expected an error, not a success'),
        error: (error) => expect(error).toBeTruthy(),
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/check`);
      expect(req.request.method).toBe('GET');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      expect(emittedValue).toBeFalsy();
    });
  });

  describe('login', () => {
    it('should login and update isAuthSubject', () => {
      const dummyCredentials: Credentials = {
        username: 'test',
        password: 'test',
      };
      const dummyResponse: AuthResponse = {
        expiry: 'dummy-expiry',
        token: 'dummy-token',
      };

      service.login(dummyCredentials).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/knox/login/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dummyCredentials);
      req.flush(dummyResponse);

      service.isAuth$.subscribe((isAuth) => {
        expect(isAuth).toEqual(true);
      });
    });

    it('should handle login errors and update isAuthSubject to false for bad credentials', () => {
      const dummyCredentials: Credentials = {
        username: 'test',
        password: 'test',
      };

      service.login(dummyCredentials).subscribe({
        next: () => fail('expected an error, not a success'),
        error: (error) => expect(error).toBeTruthy(),
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/knox/login/`);
      expect(req.request.method).toBe('POST');

      req.flush(
        {
          non_field_errors: ['Unable to log in with provided credentials.'],
        },
        { status: 400, statusText: 'Bad Request' },
      );

      service.isAuth$.subscribe((isAuth) => {
        expect(isAuth).toEqual(false);
      });
    });

    it('should handle other login errors and not update isAuthSubject', () => {
      const dummyCredentials: Credentials = {
        username: 'test',
        password: 'test',
      };

      service.login(dummyCredentials).subscribe({
        next: () => fail('expected an error, not a success'),
        error: (error) => expect(error).toBeTruthy(),
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/knox/login/`);
      expect(req.request.method).toBe('POST');

      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      let emittedValue: boolean | undefined;
      service.isAuth$.subscribe((isAuth) => {
        emittedValue = isAuth;
      });

      expect(emittedValue).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should logout, update isAuthSubject, and navigate to login', () => {
      service.logout().subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/knox/logout/`);
      expect(req.request.method).toBe('POST');
      req.flush(null, { status: 204, statusText: 'No Content' });

      service.isAuth$.subscribe((isAuth) => {
        expect(isAuth).toEqual(false);
      });
    });

    it('should handle logout errors gracefully', () => {
      service.logout().subscribe({
        next: () => fail('expected an error, not a success'),
        error: (error) => expect(error).toBeTruthy(),
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/knox/logout/`);
      expect(req.request.method).toBe('POST');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      service.isAuth$.subscribe((isAuth) => {
        expect(isAuth).toEqual(true);
      });
    });
  });
});
