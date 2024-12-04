import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'calendar-app-frontend';
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkSession().subscribe();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
