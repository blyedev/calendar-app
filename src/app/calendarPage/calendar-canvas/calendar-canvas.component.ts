import { Component } from '@angular/core';
import { CalendarEvent } from '../calendar-event';
import { CalendarEventService } from '../calendar-event-service/calendar-event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar-canvas',
  templateUrl: './calendar-canvas.component.html',
  styleUrls: ['./calendar-canvas.component.css']
})
export class CalendarCanvasComponent {
  constructor(private calendarEventService: CalendarEventService) { }

  events$: Observable<CalendarEvent[]> = this.calendarEventService.getAllEvents();
}
