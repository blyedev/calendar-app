import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequest } from 'src/app/core/models/auth-requests.models';
import { InputError } from 'src/app/core/models/auth.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoggingService } from 'src/app/core/services/logging.service';
import { InputComponent } from 'src/app/shared/components/input/input.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: ['test', Validators.required],
    password: ['asdevracr', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private logger: LoggingService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.loginForm.markAllAsTouched(); // Temporary only for testing
  }

  onSubmit(): void {
    this.logger.debug(
      `Attempt login with credentials ${JSON.stringify(this.loginForm.value)}`,
    );
    this.authService
      .login({
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!,
      })
      .subscribe({
        next: (value) => {
          if (value.status === 200) {
            const nextUrl =
              this.route.snapshot.queryParamMap.get('nextUrl') ||
              '/auth/profile';
            this.router.navigateByUrl(nextUrl);
          }
          if (value.status === 400) {
            this.handleServerSideValidationErrors(value.errors);
          }
        },
      });
  }

  private handleServerSideValidationErrors(
    errors: InputError<LoginRequest>[],
  ): void {
    errors.forEach((err) => {
      this.logger.debug(err);
      if (err.param) {
        const control = this.loginForm.get(err.param);

        if (!control) {
          this.logger.error(
            'Server Side Validation error does not match form fields',
          );
        }
        this.addServerError(control!, err);
      } else {
        this.addServerError(this.loginForm, err);
      }
    });
  }

  private addServerError(
    control: AbstractControl,
    error: InputError<LoginRequest>,
  ): void {
    const existingErrors = control.getError('serverErrors') || [];

    control!.setErrors({
      ...control!.errors,
      serverErrors: [
        ...existingErrors,
        { code: error.code, message: error.message },
      ],
    });
  }
}
