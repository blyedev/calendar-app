import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { scan, Subscription, takeWhile, timer } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent implements OnInit, OnDestroy {
  private logoutSubscription: Subscription | undefined;

  countdown$ = timer(0, 1000).pipe(
    scan((acc) => --acc, 10),
    takeWhile((x) => x >= 0),
  );
  private countdownSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.logoutSubscription = this.authService.deleteSession().subscribe({
      next: (value) => {
        if (value.status === 401) {
          this.countdownSubscription = this.countdown$.subscribe({
            complete: () => {
              this.router.navigate(['']);
            },
          });
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.logoutSubscription?.unsubscribe();
    this.countdownSubscription?.unsubscribe();
  }
}
