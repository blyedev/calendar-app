import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';

describe('AppComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authService = jasmine.createSpyObj('AuthService', [
      'checkSession',
      'logout',
    ]);
    authService.checkSession.and.returnValue(of(true));
    authService.isAuth$ = of(true);
    authService.logout.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        RouterLink,
        RouterOutlet,
        AsyncPipe,
        AppComponent,
      ],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the title 'calendar-app-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('calendar-app-frontend');
  });

  it('should call checkSession on ngOnInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(authServiceSpy.checkSession).toHaveBeenCalled();
  });

  it('should call logout method of AuthService when logout is triggered', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
