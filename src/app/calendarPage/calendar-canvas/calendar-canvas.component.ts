import { Component } from '@angular/core';
import { CalendarEvent } from '../calendar-event';
import { CalendarEventService } from '../calendar-event.service';

@Component({
  selector: 'app-calendar-canvas',
  templateUrl: './calendar-canvas.component.html',
  styleUrls: ['./calendar-canvas.component.css']
})
export class CalendarCanvasComponent {
  arrayOfObjects: {
    dayOfWeek: string;
    id: number;
    events: CalendarEvent[];
  }[] = [];

  constructor(private calendarEventService: CalendarEventService) {
    this.arrayOfObjects = this.calendarEventService.getArrayOfObjectsWithSortedEvents();
    console.log(this.arrayOfObjects);
  }
}
