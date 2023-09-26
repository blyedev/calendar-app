import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from '../calendar-event';
import { CalendarEventService } from '../calendar-event-service/calendar-event.service';

@Component({
  selector: 'app-calendar-canvas',
  templateUrl: './calendar-canvas.component.html',
  styleUrls: ['./calendar-canvas.component.css']
})
export class CalendarCanvasComponent implements OnInit {
  events: CalendarEvent[] = [];

  constructor(private calendarEventService: CalendarEventService) { }

  ngOnInit(): void {
    this.loadEventData();
  }

  loadEventData(): void {
    this.calendarEventService.getAllEvents().subscribe(events => {
      this.events = events;
      console.log(this.events); // Log the events after they are loaded
    });
  }

  getFullDayEvents(): CalendarEvent[] {
    const filteredEvents = this.events.filter(event => {
      const unixDay = 1000 * 60 * 60 * 24;
      const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
      return Math.floor(unixDaySpan / unixDay) >= 1;
    });

    return filteredEvents;
  }

  getShortEventsByDay(dayOfWeekIndex: number): CalendarEvent[] {
    if (dayOfWeekIndex < 0 || dayOfWeekIndex > 6) {
      throw new Error("Invalid day of the week index. It should be between 0 and 6.");
    }

    const eventsForDay = this.events.filter(event => {
      const eventDayOfWeek = event.startDateTime.getDay() - 1 >= 0 ? event.startDateTime.getDay() - 1 : 6;
      return eventDayOfWeek === dayOfWeekIndex;
    }).filter(event => {
      const unixDay = 1000 * 60 * 60 * 24;
      const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
      return Math.floor(unixDaySpan / unixDay) < 1;
    });

    return eventsForDay;
  }
}
