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
      console.log(this.events);
    });
  }

  getFullDayEvents(events: CalendarEvent[]): CalendarEvent[] {
    return events.filter(event => {
      // filters out events shorter than a day
      const unixDay = 1000 * 60 * 60 * 24;
      const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
      return Math.floor(unixDaySpan / unixDay) >= 1;
    });
  }

  getShortEventsByDay(events: CalendarEvent[], dayOfWeekIndex: number): CalendarEvent[] {
    // Creates the date object for the start of week
    const { dayStart, dayEnd } = this.getDayBoundries(dayOfWeekIndex);

    const filteredEvents = events.filter(event => {
      // filters out events longer than a day
      const unixDay = 1000 * 60 * 60 * 24;
      const unixDaySpan = event.endDateTime.getTime() - event.startDateTime.getTime();
      return Math.floor(unixDaySpan / unixDay) < 1;
    }).filter(event => {
      // filters out events that do not overlapped with the specified day
      return event.startDateTime.getTime() < dayEnd.getTime() && event.endDateTime.getTime() > dayStart.getTime();
    });

    return filteredEvents
  }

  getDayBoundries(dayOfWeekIndex: number): { dayStart: Date, dayEnd: Date } {
    const currentWeekStart = new Date();
    const mondayOffset = currentWeekStart.getDay() > 0 ? currentWeekStart.getDay() - 1 : 6; // 0 (Sunday) to 6 (Saturday)
    currentWeekStart.setDate(currentWeekStart.getDate() - mondayOffset);
    currentWeekStart.setHours(0, 0, 0, 0); // Midnight of Monday


    // Creates the start and end date objects from the weekStart and the dayindex parameter
    const dayStart = new Date(currentWeekStart);
    dayStart.setDate(dayStart.getDate() + dayOfWeekIndex);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    return { dayStart, dayEnd };
  }
}
