import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoggingService } from 'src/app/core/services/logging.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
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
  ) {}

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
        },
      });
  }
}
