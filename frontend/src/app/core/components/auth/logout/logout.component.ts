import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent implements OnDestroy {
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.subscription = this.authService.deleteSession().subscribe({
      next: (value) => {
        if (value.status === 401) {
          this.router.navigate(['auth', 'login']);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
