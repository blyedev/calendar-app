import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from 'src/app/core/services/auth.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    });

    const fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
