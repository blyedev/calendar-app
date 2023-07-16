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
    const eventsByDayOfWeek: CalendarEvent[][] = [];

    // Assuming you have an array of events called 'events'
    this.events.forEach((event: CalendarEvent) => {
      let dayOfWeek = event.startDateTime.getDay() - 1; // 0 (Monday) to 6 (Sunday)
      if (dayOfWeek < 0) {
        dayOfWeek = 6; // Adjust Sunday to index 6
      }
      if (!eventsByDayOfWeek[dayOfWeek]) {
        eventsByDayOfWeek[dayOfWeek] = []; // Initialize the array for the day of the week if it doesn't exist
      }

      eventsByDayOfWeek[dayOfWeek].push(event); // Push the event to the corresponding day of the week array
    });

    return eventsByDayOfWeek
  }
}