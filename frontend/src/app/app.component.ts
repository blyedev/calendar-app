import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarCanvasComponent } from './modules/calendar/calendar-canvas/calendar-canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarCanvasComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calendar-app-frontend';
}
