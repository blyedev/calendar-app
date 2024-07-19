import { Component } from '@angular/core';
import { CalendarCanvasComponent } from '../calendar-canvas/calendar-canvas.component';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CalendarCanvasComponent],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.css'
})
export class CalendarPageComponent {

}
