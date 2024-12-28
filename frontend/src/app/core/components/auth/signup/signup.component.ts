import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SignupRequest } from 'src/app/core/models/auth-requests.models';
import { InputError } from 'src/app/core/models/auth.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoggingService } from 'src/app/core/services/logging.service';
import { InputComponent } from 'src/app/shared/components/input/input.component';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm = this.formBuilder.group({
    email: ['test2@blyedev.com', [Validators.required, Validators.email]],
    username: ['test', Validators.required],
    password: ['asdevracr', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private logger: LoggingService,
    private router: Router,
  ) {
    this.signupForm.markAllAsTouched(); // Temporary only for testing
  }

  onSubmit(): void {
    this.authService
      .signup({
        email: this.signupForm.value.email!,
        username: this.signupForm.value.username!,
        password: this.signupForm.value.password!,
      })
      .subscribe({
        next: (value) => {
          if (value.status === 200) {
            this.router.navigateByUrl('/auth/profile');
          }
          if (value.status === 400) {
            this.handleServerSideValidationErrors(value.errors);
          }
        },
      });
  }

  private handleServerSideValidationErrors(
    errors: InputError<SignupRequest>[],
  ): void {
    errors.forEach((err) => {
      this.logger.debug(err);
      if (err.param) {
        const control = this.signupForm.get(err.param);

        if (!control) {
          this.logger.error(
            'Server Side Validation error does not match form fields',
          );
        }
        this.addServerError(control!, err);
      } else {
        this.addServerError(this.signupForm, err);
      }
    });
  }

  private addServerError(
    control: AbstractControl,
    error: InputError<SignupRequest>,
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
