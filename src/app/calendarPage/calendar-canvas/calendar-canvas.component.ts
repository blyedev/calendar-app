import { Component } from '@angular/core';
import { CalendarEvent } from '../calendar-event';
import { CalendarEventService } from '../calendar-event.service';

@Component({
  selector: 'app-calendar-canvas',
  templateUrl: './calendar-canvas.component.html',
  styleUrls: ['./calendar-canvas.component.css']
})
export class CalendarCanvasComponent {
  events!: CalendarEvent[];

  constructor(private calendarEventService: CalendarEventService) {
    this.loadEventData();
  }

  loadEventData(): void {
    this.calendarEventService.getAllSameDayEvents().subscribe(events =>
      this.events = events
    );
    console.log(this.events);
  }

  getEventsByDay(): CalendarEvent[][] {
    const eventsByDayOfWeek: CalendarEvent[][] = [[], [], [], [], [], [], []];

    // Assuming you have an array of events called 'events'
    this.events.forEach((event: CalendarEvent) => {
      const dayOfWeek = event.startDateTime.getDay() - 1 >= 0 ? event.startDateTime.getDay() - 1 : 6; // 0 (Monday) to 6 (Sunday)

      eventsByDayOfWeek[dayOfWeek].push(event); // Push the event to the corresponding day of the week array
    });

    return eventsByDayOfWeek
  }
}