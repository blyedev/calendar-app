import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoggingService } from 'src/app/core/services/logging.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm = this.formBuilder.group({
    email: ['test2@blyedev.com', [Validators.required, Validators.email]],
    username: ['test', Validators.required],
    password: ['asdevracr', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private logger: LoggingService,
    private router: Router,
  ) {}

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
            this.logger.error(value);
          }
        },
      });
  }
}
